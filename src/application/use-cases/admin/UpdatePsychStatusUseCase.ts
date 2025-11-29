import { UpdatePsychStatusDTO } from "../../dtos/admin.dto.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IUpdatePsychStatusUseCase from "../../interfaces/IUpdatePsychStatusUseCase.js";
import { PsychologistStatus } from "../../../domain/enums/PsychologistStatus.js";

export class UpdatePsychUseCase implements IUpdatePsychStatusUseCase {
  constructor(private readonly _psychRepository: IPsychRepository) {}

  async execute(dto: UpdatePsychStatusDTO): Promise<void> {
    const psych = await this._psychRepository.findById(dto.applicationId);
    if (!psych)
      throw new AppError(
        ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND,
        AppErrorCodes.NOT_FOUND
      );
    psych.isBlocked = dto.status === PsychologistStatus.INACTIVE;
    await this._psychRepository.update(dto.applicationId, psych);
  }
}
