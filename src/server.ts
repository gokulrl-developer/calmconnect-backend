import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { connectDB } from "./infrastructure/config/mongoDB.js";
import CheckSessionAccessUseCase from "./application/use-cases/CheckSessionAccessUseCase.js";
import PostMessageUseCase from "./application/use-cases/PostMessageUseCase.js";
import GetMessagesUseCase from "./application/use-cases/GetMessagesUseCase.js";
import { CheckStatusPsychUseCase } from "./application/use-cases/psychologist/CheckStatusPsychUseCase.js";
import { CheckStatusUserUseCase } from "./application/use-cases/user/CheckStatusUserUseCase.js";
import SocketServer from "./infrastructure/external/SocketServer.js";
import PsychRepository from "./infrastructure/database/repositories/PsychRepository.js";
import UserRepository from "./infrastructure/database/repositories/UserRepository.js";
import SessionRepository from "./infrastructure/database/repositories/SessionRepository.js";
import { ChatMessageRepository } from "./infrastructure/database/repositories/ChatMessageRepository.js";
import { eventBus } from "./infrastructure/external/eventBus.js";
import SendNotificationUseCase from "./application/use-cases/SendNotificationUseCase.js";
import NotificationHandler from "./application/event-handlers/NotificationHandler.js";
import { NotificationRepository } from "./infrastructure/database/repositories/NotificationRepository.js";
import MarkSessionOverUseCase from "./application/use-cases/MarkSessionOverUseCase.js";
import TransactionRepository from "./infrastructure/database/repositories/TransactionRepository.js";
import WalletRepository from "./infrastructure/database/repositories/WalletRepository.js";
import app from "./app.js";
import BullMQSessionTaskWorker from "./infrastructure/external/BullMQSessionTaskWorker.js";
import AdminRepository from "./infrastructure/database/repositories/AdminRepository.js";
import { AdminBootstrapper } from "./infrastructure/external/BootStrapAdmin.js";

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
    const transactionRepository = new TransactionRepository();
    const walletRepository = new WalletRepository();
    const adminRepository =new AdminRepository();

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
      checkStatusUserUseCase,
      eventBus
    );

    const sendNotificationUseCase = new SendNotificationUseCase(
      notificationRepository,
      socketServer
    );
    const markSessionOverUseCase = new MarkSessionOverUseCase(
      sessionRepository,
      transactionRepository,
      walletRepository,
      adminRepository
    );

    const notificationHandler = new NotificationHandler(
      sendNotificationUseCase,
      adminRepository,
      userRepository,
      psychRepository,
      sessionRepository
    );
    new BullMQSessionTaskWorker(sendNotificationUseCase,markSessionOverUseCase)
    notificationHandler.subscribe(eventBus);
    const adminBootStrapper=new AdminBootstrapper();
     await adminBootStrapper.execute();
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
