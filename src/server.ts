import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import http from "http";
import { connectDB } from "./infrastructure/config/mongoDB";
import CheckSessionAccessUseCase from "./application/use-cases/CheckSessionAccessUseCase";
import PostMessageUseCase from "./application/use-cases/PostMessageUseCase";
import GetMessagesUseCase from "./application/use-cases/GetMessagesUseCase";
import { CheckStatusPsychUseCase } from "./application/use-cases/psychologist/CheckStatusPsychUseCase";
import { CheckStatusUserUseCase } from "./application/use-cases/user/CheckStatusUserUseCase";
import SocketServer from "./infrastructure/external/SocketServer";
import PsychRepository from "./infrastructure/database/repositories/PsychRepository";
import UserRepository from "./infrastructure/database/repositories/UserRepository";
import SessionRepository from "./infrastructure/database/repositories/SessionRepository";
import { ChatMessageRepository } from "./infrastructure/database/repositories/ChatMessageRepository";
import { eventBus } from "./infrastructure/external/eventBus";
import SendNotificationUseCase from "./application/use-cases/SendNotificationUseCase";
import NotificationHandler from "./application/event-handlers/NotificationHandler";
import { NotificationRepository } from "./infrastructure/database/repositories/NotificationRepository";
import MarkSessionOverUseCase from "./application/use-cases/MarkSessionOverUseCase";
import BullMQSessionTaskWorker from "./infrastructure/external/BullMQSessionTaskWorker";
import TransactionRepository from "./infrastructure/database/repositories/TransactionRepository";
import WalletRepository from "./infrastructure/database/repositories/WalletRepository";

const PORT = process.env.PORT || 5000;


const startServer = async () => {
  try {
    await connectDB();

    const httpServer = http.createServer(app);

    const sessionRepository = new SessionRepository();
    const chatMessageRepository = new ChatMessageRepository();
    const userRepository = new UserRepository();
    const notificationRepository = new NotificationRepository();
    const psychRepository = new PsychRepository();
    const transactionRepository=new TransactionRepository();
    const walletRepository=new WalletRepository();

    const checkSessionAccessUseCase = new CheckSessionAccessUseCase(
      sessionRepository
    );
    const postMessageUseCase = new PostMessageUseCase(
      chatMessageRepository,
      userRepository,
      psychRepository
    );
    const getMessagesUseCase = new GetMessagesUseCase(chatMessageRepository);
    const checkStatusPsychUseCase = new CheckStatusPsychUseCase(
      psychRepository
    );
    const checkStatusUserUseCase = new CheckStatusUserUseCase(userRepository);
    
    const socketServer = new SocketServer(
      httpServer,
      checkSessionAccessUseCase,
      postMessageUseCase,
      getMessagesUseCase,
      checkStatusPsychUseCase,
      checkStatusUserUseCase
    );
    
    const sendNotificationUseCase = new SendNotificationUseCase(
      notificationRepository,
      socketServer
    );
    const markSessionOverUseCase =new MarkSessionOverUseCase(sessionRepository,transactionRepository,walletRepository)

    const bullMQSessionTaskWorker=new BullMQSessionTaskWorker(sendNotificationUseCase,markSessionOverUseCase)
   const notificationHandler = new NotificationHandler(
      sendNotificationUseCase
    );
   notificationHandler.subscribe(eventBus);
    socketServer.initialize();
    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
