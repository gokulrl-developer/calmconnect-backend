import { PostMessageDTO } from "../dtos/shared.dto.js";
import IPostMessageUseCase from "../interfaces/IPostMessageUseCase.js";
import IUserRepository from "../../domain/interfaces/IUserRepository.js";
import IPsychRepository from "../../domain/interfaces/IPsychRepository.js";
import AppError from "../error/AppError.js";
import { ERROR_MESSAGES } from "../constants/error-messages.constants.js";
import { AppErrorCodes } from "../error/app-error-codes.js";
import { IChatMessageRepository } from "../../domain/interfaces/IChatMessageRepository.js";
import { mapDomainToGetMessagesResponse, mapPostMessageDTOToDomain } from "../mappers/ChatMessageMapper.js";
import { GetMessageResponse } from "../interfaces/IGetMessagesUseCase.js";

export default class PostMessageUseCase implements IPostMessageUseCase {
  constructor(
    private readonly _chatMessageRepo: IChatMessageRepository,
    private readonly _userRepo: IUserRepository,
    private readonly _psychRepo: IPsychRepository
  ) {}

  async execute(dto: PostMessageDTO): Promise<GetMessageResponse> {

    let senderId: string;
    let senderName: string;

    if (dto.userId) {
      const user = await this._userRepo.findById(dto.userId);
      if (!user) {
        throw new AppError(
          ERROR_MESSAGES.USER_NOT_FOUND,
          AppErrorCodes.NOT_FOUND
        );
      }
      senderId = user.id!;
      senderName = `${user.firstName} ${user.lastName}`;
    } else if (dto.psychId) {
      const psych = await this._psychRepo.findById(dto.psychId);
      if (!psych) {
        throw new AppError(
          ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND,
          AppErrorCodes.NOT_FOUND
        );
      }
      senderId = psych.id!;
      senderName = `${psych.firstName} ${psych.lastName}`;
    }

    const message = mapPostMessageDTOToDomain(dto, senderId!, senderName!);

    const createdMessage= await this._chatMessageRepo.create(message);
    return mapDomainToGetMessagesResponse(createdMessage)
  }
}
