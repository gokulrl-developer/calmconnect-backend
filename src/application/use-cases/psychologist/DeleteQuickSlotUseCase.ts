import IDeleteQuickSlotUseCase from "../../interfaces/IDeleteQuickSlotUseCase.js";
import { DeleteQuickSlotDTO } from "../../dtos/psych.dto.js";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";

export default class DeleteQuickSlotUseCase implements IDeleteQuickSlotUseCase {
  constructor(
    private readonly _quickSlotRepository: IQuickSlotRepository,
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
