import IDeleteAvailabilityRuleUseCase from "../../interfaces/IDeleteAvailabilityRuleUseCase";
import { DeleteAvailabilityRuleDTO } from "../../dtos/psych.dto";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";

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
      status: "inactive"
    });
  }
}
