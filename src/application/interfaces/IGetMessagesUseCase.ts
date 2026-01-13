import { GetMessagesDTO } from "../dtos/shared.dto.js";

export interface GetMessageResponse {
  sessionId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: Date;
  chatMessageId: string;
}
export default interface IGetMessagesUseCase{
    execute(dto:GetMessagesDTO):Promise<GetMessageResponse[]>
}