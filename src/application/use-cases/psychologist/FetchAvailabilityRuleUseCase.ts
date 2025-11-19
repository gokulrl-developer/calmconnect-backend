import IFetchAvailabilityRuleUseCase, { AvailabilityRuleDetails } from "../../interfaces/IFetchAvailabilityRuleUseCase.js";
import { FetchAvailabilityRule } from "../../dtos/psych.dto.js";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository.js";
import { mapDomainToRuleDetailsResponse } from "../../mappers/AvailabilityRuleMapper.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";

export default class FetchAvailabilityRuleUseCase implements IFetchAvailabilityRuleUseCase {
  constructor(
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository
  ) {}

  async execute(dto: FetchAvailabilityRule): Promise<AvailabilityRuleDetails> {
    const existingRule = await this._availabilityRuleRepository.findById(dto.availabilityRuleId);
    if (!existingRule) {
      throw new AppError(ERROR_MESSAGES.AVAILABILITY_RULE_NOT_FOUND, AppErrorCodes.NOT_FOUND);
    }

    if (existingRule.psychologist !== dto.psychId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORISED_ACTION, AppErrorCodes.FORBIDDEN_ERROR);
    }

    return mapDomainToRuleDetailsResponse(existingRule);

    
  }
}
