import { Server as HttpServer } from "http";
import AppError from "../../application/error/AppError";
import { ERROR_MESSAGES } from "../../application/constants/error-messages.constants";
import { AppErrorCodes } from "../../application/error/app-error-codes";
import { verifyAccessToken } from "../../utils/tokenHandler";
import { Server as IOServer, Socket } from "socket.io";

import ICheckSessionAccessUseCase from "../../application/interfaces/ICheckSessionAccessUseCase";
import IPostMessageUseCase from "../../application/interfaces/IPostMessageUseCase";
import IGetMessagesUseCase from "../../application/interfaces/IGetMessagesUseCase";
import ICheckStatusPsychUseCase from "../../application/interfaces/ICheckStatusPsychUseCase";
import ICheckStatusUserUseCase from "../../application/interfaces/ICheckStatusUserUseCase";
import { CheckSessionAccessDTO, PostMessageDTO } from "../../application/dtos/shared.dto";

export default class SocketServer {
  private _io: IOServer;
  constructor(
    private readonly _httpServer: HttpServer,
    private readonly _checkSessionAccessUseCase: ICheckSessionAccessUseCase,
    private readonly _postMessageUseCase: IPostMessageUseCase,
    private readonly _getMessagesUseCase: IGetMessagesUseCase,
    private readonly _checkStatusPsychUseCase:ICheckStatusPsychUseCase,
    private readonly _checkStatusUserUseCase:ICheckStatusUserUseCase
  ) {
    this._io = new IOServer(this._httpServer, {
          cors: { origin: "*" }
        });
  }
  

  public initialize(){
    this._io.use(this.authenticateSocket.bind(this));
    this.setupEventHandlers();
  };

  private async authenticateSocket(socket: Socket, next: (err?: Error) => void) {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      const token = cookieHeader?.split(";")
        .map(c => c.trim())
        .find(c => c.startsWith("accessToken="))
        ?.split("=")[1];

      if (!token) {
        throw new AppError(ERROR_MESSAGES.SESSION_EXPIRED, AppErrorCodes.INVALID_CREDENTIALS);
      }
      const decoded = await verifyAccessToken(token);
      if (!decoded || !decoded.id || !decoded.role) {
        throw new AppError(ERROR_MESSAGES.SESSION_EXPIRED, AppErrorCodes.SESSION_EXPIRED);
      }

      socket.data.accountId = decoded.id;
      socket.data.role = decoded.role;
     if(decoded.role==="user"){
      await this._checkStatusUserUseCase.execute({id:decoded.id})
    }else if(decoded.role==="psychologist"){
       await this._checkStatusPsychUseCase.execute({id:decoded.id})
     }
     next();
    } catch (err) {
     if (err instanceof Error) {
      next(err);
    } else {
      next(new Error(String(err)));
    }
    }
  }

  private setupEventHandlers(): void {
    this._io.on("connection", (socket: Socket) => {
      const accountId = socket.data.accountId;
      console.log("socket connected:", accountId);

      socket.on("join-room", async (data: { sessionId: string }) => {
        try {
          const { sessionId } = data;
          socket.data.sessionId = sessionId;
          let dto:CheckSessionAccessDTO;
          if(socket.data.role==="user"){
            dto={
              sessionId,
              userId:accountId,
            }
          }else if (socket.data.role==="psychologist"){
            dto={
              sessionId,
              psychId:accountId
            }
          }
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
        } catch (err) {
          console.error(err);
          socket.emit("error", { message: "join_error" });
        }
      });

    socket.on("chat-message", async (payload: { sessionId: string; text: string }) => {
  try {
    let dto: PostMessageDTO;

    if (socket.data.role === "user") {
      dto = {
        sessionId: payload.sessionId,
        userId: accountId,
        text: payload.text,
      };
    } else if (socket.data.role === "psychologist") {
      dto = {
        sessionId: payload.sessionId,
        psychId: accountId,
        text: payload.text,
      };
    }

    const message=await this._postMessageUseCase.execute(dto!);

    const room = `room:${payload.sessionId}`;

    this._io.to(room).emit("chat-message", message);

  } catch (err) {
    console.error("chat-message error:", err);
  }
});

      socket.on("signal", (payload: { sessionId: string; type: string; data: any }) => {
        try {
          const room = `room:${payload.sessionId}`;
          socket.to(room).emit("signal", payload);
          console.log("Signal relayed:", payload.type);
        } catch (err) {
          console.error("Signal relay error:", err);
        }
      });
      socket.on("leave-room", (payload: { accountId: string }) => {
        const room = `room:${socket.data.sessionId}`;
        socket.leave(room);
        socket.to(room).emit("peer-left", { accountId });
      });

      socket.on("disconnect", () => {
        console.log("socket disconnected:", accountId);
      });

    });
    console.log('connection configured')
  }

  public getServer(): IOServer {
    return this._io;
  }
}
