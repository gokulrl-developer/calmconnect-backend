import { ChatMessage } from "../entities/chat-message.entity";
import IBaseRepository from "./IBaseRepository";

export interface IChatMessageRepository extends IBaseRepository<ChatMessage>{
  findBySession(sessionId: string, limit?: number): Promise<ChatMessage[]>;
}