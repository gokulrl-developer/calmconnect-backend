import { Server as IOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import AppError from "../../application/error/AppError.js";
import { ERROR_MESSAGES } from "../../application/constants/error-messages.constants.js";
import { AppErrorCodes } from "../../application/error/app-error-codes.js";
import { verifyAccessToken } from "../../utils/tokenHandler.js";

import ICheckSessionAccessUseCase from "../../application/interfaces/ICheckSessionAccessUseCase.js";
import IPostMessageUseCase from "../../application/interfaces/IPostMessageUseCase.js";
import IGetMessagesUseCase from "../../application/interfaces/IGetMessagesUseCase.js";
import ICheckStatusPsychUseCase from "../../application/interfaces/ICheckStatusPsychUseCase.js";
import ICheckStatusUserUseCase from "../../application/interfaces/ICheckStatusUserUseCase.js";
import {
  CheckSessionAccessDTO,
  PostMessageDTO,
} from "../../application/dtos/shared.dto.js";
import { SendNotificationPayload } from "../../domain/interfaces/ISocketService.js";
import ISocketService from "../../domain/interfaces/ISocketService.js";
import { IEventBus } from "../../application/interfaces/events/IEventBus.js";
import { EventMapEvents } from "../../domain/enums/EventMapEvents.js";


export interface SignalPayload {
  sessionId: string;
  type: "offer" | "answer" | "candidate";
  data: RTCSessionDescriptionInit | RTCIceCandidateInit;
}


export default class SocketServer implements ISocketService {
  private _io: IOServer;
  private _userSocketMap: Map<string, string>;

  constructor(
    private readonly _httpServer: HttpServer,
    private readonly _checkSessionAccessUseCase: ICheckSessionAccessUseCase,
    private readonly _postMessageUseCase: IPostMessageUseCase,
    private readonly _getMessagesUseCase: IGetMessagesUseCase,
    private readonly _checkStatusPsychUseCase: ICheckStatusPsychUseCase,
    private readonly _checkStatusUserUseCase: ICheckStatusUserUseCase,
    private readonly _eventBus:IEventBus
  ) {
    this._io = new IOServer(this._httpServer, { cors: { origin: "*" } });
    this._userSocketMap = new Map();
  }

  public initialize() {
    this.initializeNotificationNamespace();
    this.initializeMeetingNamespace();
    console.log(
      "Socket namespaces configured with global auth: /notifications & /meeting"
    );
  }

  // ---------------- Notifications Namespace ----------------
  private initializeNotificationNamespace() {
    const notifNS = this._io.of("/notifications");

    notifNS.use(this.authenticateSocket.bind(this));

    notifNS.on("connection", (socket: Socket) => {
      const accountId = socket.data.accountId;
      console.log("Notification socket connected:", accountId);

      socket.on("register", () => {
        try {
          this._userSocketMap.set(accountId, socket.id);
          console.log(
            `Account:${accountId} registered for notifications with socket ${socket.id}`
          );
        } catch (e) {
          console.error("Socket register error", e);
        }
      });

      socket.on("disconnect", () => {
        for (const [accountId, sid] of this._userSocketMap.entries()) {
          if (sid === socket.id) {
            this._userSocketMap.delete(accountId);
            console.log(`Account ${accountId} disconnected from notifications`);
          }
        }
      });
    });
    notifNS.on("connect_error", (err) => {
      console.log("Connection failed:", err.message);
    });
  }

  public async sendToUser(
    accountId: string,
    payload: SendNotificationPayload
  ): Promise<boolean> {
    const sid = this._userSocketMap.get(accountId);
    console.log(" the socket id in sendToUser",sid)
    if (!sid) return false;

    try {
      this._io.of("/notifications").to(sid).emit("notification", payload);
      console.log(`Notification sent to ${accountId}: ${payload.title}`);
      return true;
    } catch (err) {
      console.error("Socket send error", err);
      return false;
    }
  }

  // ----------------Meeting Namespace ----------------
  private initializeMeetingNamespace() {
    const meetingNS = this._io.of("/meeting");

    meetingNS.use(this.authenticateSocket.bind(this));

    meetingNS.on("connection", (socket: Socket) => {
      const accountId = socket.data.accountId;
      console.log("Meeting socket connected:", accountId);

      socket.on("join-room", async (data: { sessionId: string }) => {
        try {
          const { sessionId } = data;
          socket.data.sessionId = sessionId;

          let dto: CheckSessionAccessDTO;
          if (socket.data.role === "user")
            dto = { sessionId, userId: accountId };
          else if (socket.data.role === "psychologist")
            dto = { sessionId, psychId: accountId };

          const res = await this._checkSessionAccessUseCase.execute(dto!);
          if (!res.allowed) {
            socket.emit("join-denied", { reason: res.reason });
            return;
          }
          
          const room = `room:${sessionId}`;
          socket.join(room);
          
          const history = await this._getMessagesUseCase.execute({ sessionId });
          socket.emit("chat-history", history);
          socket.emit("join-accepted", { session: res.session });
          
          socket.to(room).emit("peer-joined", { accountId });
          if(socket.data.role==="user"){
            this._eventBus.emit(EventMapEvents.USER_JOINED,{sessionId})
          }else if(socket.data.role==="psychologist"){
          this._eventBus.emit(EventMapEvents.PSYCHOLOGIST_JOINED,{sessionId})
          }
        } catch (err) {
          console.error(err);
          socket.emit("error", { message: "Error while joining the meeting" });
        }
      });

      socket.on(
        "chat-message",
        async (payload: { sessionId: string; text: string }) => {
          try {
            let dto: PostMessageDTO;
            if (socket.data.role === "user")
              dto = {
                sessionId: payload.sessionId,
                userId: accountId,
                text: payload.text,
              };
            else if (socket.data.role === "psychologist")
              dto = {
                sessionId: payload.sessionId,
                psychId: accountId,
                text: payload.text,
              };

            const message = await this._postMessageUseCase.execute(dto!);
            const room = `room:${payload.sessionId}`;
            meetingNS.to(room).emit("chat-message", message);
          } catch (err) {
              socket.emit("error",{
                message:"error on sending message"
              })
            console.error("chat-message error:", err);
          }
        }
      );

      socket.on("signal", (payload: SignalPayload) => {
        try {
          const room = `room:${payload.sessionId}`;
          socket.to(room).emit("signal", payload);
          console.log("Signal relayed:", payload.type);
        } catch (err) {
          console.error("Signal relay error:", err);
          socket.emit("emit",{
            message:"Error on connecting with peer"
          })
        }
      });

      socket.on("leave-room", () => {
        const room = `room:${socket.data.sessionId}`;
        socket.leave(room);
        socket.to(room).emit("peer-left", { accountId });
      });

      socket.on("disconnect", () => {
        console.log(" Meeting socket disconnected:", accountId);
      });
    });

    meetingNS.on("connect_error", (err) => {
      console.log("Connection failed:", err.message);
    });
  }

  private async authenticateSocket(
    socket: Socket,
    next: (err?: Error) => void
  ) {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      const token = cookieHeader
        ?.split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("accessToken="))
        ?.split("=")[1];
        
        if (!token) {
          throw new AppError(
            ERROR_MESSAGES.SESSION_EXPIRED,
            AppErrorCodes.INVALID_CREDENTIALS
          );
        }        
        const decoded = await verifyAccessToken(token);
        if (!decoded?.id || !decoded?.role) {
          throw new AppError(
            ERROR_MESSAGES.SESSION_EXPIRED,
            AppErrorCodes.SESSION_EXPIRED
          );
        }

      socket.data.accountId = decoded.id;
      socket.data.role = decoded.role;
      if (decoded.role === "user")
        await this._checkStatusUserUseCase.execute({ id: decoded.id });
      else if (decoded.role === "psychologist")
        await this._checkStatusPsychUseCase.execute({ id: decoded.id });

      next();
    } catch (err) {
      if (err instanceof Error) {
        next(err);
      } else {
        next(new Error(String(err)));
      }
    }
  }

  public getServer(): IOServer {
    return this._io;
  }
}
