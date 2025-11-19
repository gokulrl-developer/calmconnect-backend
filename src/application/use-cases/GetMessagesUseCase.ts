import { ChatMessage } from "../../domain/entities/chat-message.entity.js";
import { GetMessagesDTO } from "../dtos/shared.dto.js";
import IGetMessagesUseCase, { GetMessageResponse } from "../interfaces/IGetMessagesUseCase.js";
import { IChatMessageRepository } from "../../domain/interfaces/IChatMessageRepository.js";
import { mapDomainToGetMessagesResponse } from "../mappers/ChatMessageMapper.js";

export default class GetMessagesUseCase implements IGetMessagesUseCase{
  constructor(private readonly _chatMessageRepo: IChatMessageRepository) {}

  async execute(dto: GetMessagesDTO): Promise<GetMessageResponse[]> {
    const messages: ChatMessage[] = await this._chatMessageRepo.findBySession(dto.sessionId);
    const response: GetMessageResponse[] = messages.map(mapDomainToGetMessagesResponse);
    return response;
  }
}
