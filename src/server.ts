import dotenv from 'dotenv';
dotenv.config();

import app  from "./app";
import http from "http"
import { connectDB } from "./infrastructure/config/mongoDB";
import CheckSessionAccessUseCase from './application/use-cases/CheckSessionAccessUseCase';
import PostMessageUseCase from './application/use-cases/PostMessageUseCase';
import GetMessagesUseCase from './application/use-cases/GetMessagesUseCase';
import { CheckStatusPsychUseCase } from './application/use-cases/psychologist/CheckStatusPsychUseCase';
import { CheckStatusUserUseCase } from './application/use-cases/user/CheckStatusUserUseCase';
import SocketServer from './infrastructure/external/SocketServer';
import PsychRepository from './infrastructure/database/repositories/PsychRepository';
import UserRepository from './infrastructure/database/repositories/UserRepository';
import SessionRepository from './infrastructure/database/repositories/SessionRepository';
import { ChatMessageRepository } from './infrastructure/database/repositories/ChatMessageRepository';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); 

    const httpServer = http.createServer(app);

    const sessionRepository = new SessionRepository();
    const chatMessageRepository = new ChatMessageRepository();
    const userRepository = new UserRepository();
    const psychRepository = new PsychRepository();

    const checkSessionAccessUseCase = new CheckSessionAccessUseCase(sessionRepository);
    const postMessageUseCase = new PostMessageUseCase(
      chatMessageRepository,
      userRepository,
      psychRepository
    );
    const getMessagesUseCase = new GetMessagesUseCase(chatMessageRepository);
    const checkStatusPsychUseCase = new CheckStatusPsychUseCase(psychRepository);
    const checkStatusUserUseCase = new CheckStatusUserUseCase(userRepository);

    const socketServer = new SocketServer(
      httpServer,
      checkSessionAccessUseCase,
      postMessageUseCase,
      getMessagesUseCase,
      checkStatusPsychUseCase,
      checkStatusUserUseCase
    );

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




