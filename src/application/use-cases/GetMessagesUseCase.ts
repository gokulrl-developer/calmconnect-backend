import { ChatMessage } from "../../domain/entities/chat-message.entity";
import { GetMessagesDTO } from "../dtos/shared.dto";
import IGetMessagesUseCase, { GetMessageResponse } from "../interfaces/IGetMessagesUseCase";
import AppError from "../error/AppError";
import { ERROR_MESSAGES } from "../constants/error-messages.constants";
import { AppErrorCodes } from "../error/app-error-codes";
import { IChatMessageRepository } from "../../domain/interfaces/IChatMessageRepository";
import { mapDomainToGetMessagesResponse } from "../mappers/ChatMessageMapper";



export default class GetMessagesUseCase implements IGetMessagesUseCase{
  constructor(private readonly _chatMessageRepo: IChatMessageRepository) {}

  async execute(dto: GetMessagesDTO): Promise<GetMessageResponse[]> {
    const messages: ChatMessage[] = await this._chatMessageRepo.findBySession(dto.sessionId);
    const response: GetMessageResponse[] = messages.map(mapDomainToGetMessagesResponse);
    return response;
  }
}
