import { ChatMessage } from "../../domain/entities/chat-message.entity";
import { PostMessageDTO } from "../dtos/shared.dto";

export const mapDomainToGetMessagesResponse=(message:ChatMessage)=>{
    return{
      sessionId:message.sessionId,
      senderId:message.senderId,
      senderName:message.senderName,
      text:message.text,
      createdAt:message.createdAt,
      id:message.id!, 
    }
}

export const mapPostMessageDTOToDomain=(dto:PostMessageDTO,senderId:string,senderName:string):ChatMessage=>{
    return new ChatMessage(
        dto.sessionId,
        senderId,
        senderName,
        dto.text,
        new Date()
    );    
  }