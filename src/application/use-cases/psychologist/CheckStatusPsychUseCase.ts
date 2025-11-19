import { PsychCheckStatusDTO } from "../../dtos/psych.dto.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import ICheckStatusPsychUseCase from "../../interfaces/ICheckStatusPsychUseCase.js";


export class CheckStatusPsychUseCase implements ICheckStatusPsychUseCase {
  constructor(
    private readonly _PsychRepository: IPsychRepository
) {}

  async execute(dto: PsychCheckStatusDTO){
    const psych = await this._PsychRepository.findById(dto.id);

    if (!psych) {
      throw new AppError(ERROR_MESSAGES.ACCOUNT_LOGGED_OUT,AppErrorCodes.INVALID_CREDENTIALS);
    }

    if (psych.isBlocked) {
      throw new AppError(ERROR_MESSAGES.ACCOUNT_BLOCKED,AppErrorCodes.BLOCKED);
    }

    return {isVerified:psych.isVerified}
  }
}
