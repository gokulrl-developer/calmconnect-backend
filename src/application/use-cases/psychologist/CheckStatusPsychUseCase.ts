import { PsychCheckStatusDTO } from "../../dtos/psych.dto";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import ICheckStatusPsychUseCase from "../../interfaces/ICheckStatusPsychUseCase";


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
