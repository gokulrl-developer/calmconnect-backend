import { ChatMessage } from "../entities/chat-message.entity.js";
import IBaseRepository from "./IBaseRepository.js";

export interface IChatMessageRepository extends IBaseRepository<ChatMessage>{
  findBySession(sessionId: string, limit?: number): Promise<ChatMessage[]>;
}