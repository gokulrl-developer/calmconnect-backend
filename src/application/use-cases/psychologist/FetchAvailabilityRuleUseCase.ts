import IFetchAvailabilityRuleUseCase, { AvailabilityRuleDetails } from "../../interfaces/IFetchAvailabilityRuleUseCase";
import { FetchAvailabilityRule } from "../../dtos/psych.dto";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import { mapDomainToRuleDetailsResponse } from "../../mappers/AvailabilityRuleMapper";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";

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
