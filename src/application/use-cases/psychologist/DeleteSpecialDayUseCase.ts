import IDeleteSpecialDayUseCase from "../../interfaces/IDeleteSpecialDayUseCase";
import { DeleteSpecialDayDTO } from "../../dtos/psych.dto";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";

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
      status: "inactive"
    });
  }
}
