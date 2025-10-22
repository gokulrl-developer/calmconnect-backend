import { Types } from "mongoose";
import { ChatMessage } from "../../../domain/entities/chat-message.entity";
import { BaseRepository } from "./BaseRepository";
import { ChatModel, IChatMessageDocument } from "../models/ChatMessageModel";
import { IChatMessageRepository } from "../../../domain/interfaces/IChatMessageRepository";


export class ChatMessageRepository
  extends BaseRepository<ChatMessage, IChatMessageDocument>
  implements IChatMessageRepository
{
  constructor() {
    super(ChatModel); 
  }

  protected toDomain(doc: IChatMessageDocument): ChatMessage {
    const chat = doc.toObject();
    return new ChatMessage(
      chat.sessionId,
      chat.senderId,
      chat.senderName,
      chat.text,
      chat.createdAt,
      chat._id.toString()
    );
  }

  protected toPersistence(entity: Partial<ChatMessage>): Partial<IChatMessageDocument> {
    const persistenceObj: Partial<IChatMessageDocument> = {};

    if (entity.sessionId) persistenceObj.sessionId = new Types.ObjectId(entity.sessionId);
    if (entity.senderId) persistenceObj.senderId = new Types.ObjectId(entity.senderId);
    if(entity.senderName) persistenceObj.senderName=entity.senderName;
    if (entity.text) persistenceObj.text = entity.text;
    if (entity.createdAt) persistenceObj.createdAt = entity.createdAt;
    if (entity.id) persistenceObj._id = new Types.ObjectId(entity.id);

    return persistenceObj;
  }

  async findBySession(sessionId: string): Promise<ChatMessage[]> {
    const docs = await this.model 
      .find({ sessionId })
      .sort({ createdAt: 1 })
      .exec();
    return docs.map((doc) => this.toDomain(doc as IChatMessageDocument));
  }
}
