import IDeleteSpecialDayUseCase from "../../interfaces/IDeleteSpecialDayUseCase.js";
import { DeleteSpecialDayDTO } from "../../dtos/psych.dto.js";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import { SpecialDayStatus } from "../../../domain/enums/SpecialDayStatus.js";

export default class DeleteSpecialDayUseCase implements IDeleteSpecialDayUseCase {
  constructor(
    private readonly _specialDayRepository: ISpecialDayRepository,
    private readonly _psychologistRepository: IPsychRepository
  ) {}

  async execute(dto: DeleteSpecialDayDTO): Promise<void> {
    const existingSpecialDay = await this._specialDayRepository.findById(dto.specialDayId);
    if (!existingSpecialDay) {
      throw new AppError(ERROR_MESSAGES.SPECIAL_DAY_NOT_FOUND, AppErrorCodes.NOT_FOUND);
    }

    const psychologist = await this._psychologistRepository.findById(dto.psychId);
    if (!psychologist) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORISED_ACTION, AppErrorCodes.FORBIDDEN_ERROR);
    }

    await this._specialDayRepository.update(existingSpecialDay.id!, {
      status: SpecialDayStatus.INACTIVE
    });
  }
}
