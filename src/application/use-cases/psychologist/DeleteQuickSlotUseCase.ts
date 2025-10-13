import IDeleteQuickSlotUseCase from "../../interfaces/IDeleteQuickSlotUseCase";
import { DeleteQuickSlotDTO } from "../../dtos/psych.dto";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";

export default class DeleteQuickSlotUseCase implements IDeleteQuickSlotUseCase {
  constructor(
    private readonly _quickSlotRepository: IQuickSlotRepository,
    private readonly _psychologistRepository: IPsychRepository
  ) {}

  async execute(dto: DeleteQuickSlotDTO): Promise<void> {
    const existingQuickSlot = await this._quickSlotRepository.findById(dto.quickSlotId);
    if (!existingQuickSlot) {
      throw new AppError(ERROR_MESSAGES.QUICK_SLOT_NOT_FOUND, AppErrorCodes.NOT_FOUND);
    }

    if (existingQuickSlot.psychologist !== dto.psychId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORISED_ACTION, AppErrorCodes.FORBIDDEN_ERROR);
    }

    await this._quickSlotRepository.update(existingQuickSlot.id!, {
      status: "inactive",
    });
  }
}
