import IDeleteAvailabilityRuleUseCase from "../../interfaces/IDeleteAvailabilityRuleUseCase.js";
import { DeleteAvailabilityRuleDTO } from "../../dtos/psych.dto.js";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import { AvailabilityRuleStatus } from "../../../domain/enums/AvailabilityRuleStatus.js";

export default class DeleteAvailabilityRuleUseCase implements IDeleteAvailabilityRuleUseCase {
  constructor(
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository
  ) {}

  async execute(dto: DeleteAvailabilityRuleDTO): Promise<void> {

    const existingRule = await this._availabilityRuleRepository.findById(dto.availabilityRuleId);
    if (!existingRule) {
      throw new AppError(ERROR_MESSAGES.AVAILABILITY_RULE_NOT_FOUND, AppErrorCodes.NOT_FOUND);
    }

    if (existingRule.psychologist !== dto.psychId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORISED_ACTION, AppErrorCodes.FORBIDDEN_ERROR);
    }

    await this._availabilityRuleRepository.update(existingRule.id!, {
      status: AvailabilityRuleStatus.INACTIVE
    });
  }
}
