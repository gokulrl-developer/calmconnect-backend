import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import { timeStringToMinutes } from "../../../utils/timeConverter";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { CreateAvaialabilityRuleDTO } from "../../dtos/psych.dto";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import ICreateAvailabilityRuleUseCase from "../../interfaces/ICreateAvailabilityRuleUseCase";
import { mapCreateAvailabilityRuleDTOToDomain } from "../../mappers/AvailabilityRuleMapper";

export default class CreateAvailabilityRuleUseCase
  implements ICreateAvailabilityRuleUseCase
{
  constructor(
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository
  ) {}
  async execute(dto: CreateAvaialabilityRuleDTO) {
    const avaialbilityRule = mapCreateAvailabilityRuleDTOToDomain(dto);
    const weekDayAvailabilityRules =
      await this._availabilityRuleRepository.findActiveByWeekDayPsych(
        dto.weekDay,
        dto.psychId
      );
      let currentRuleStartMinutes=timeStringToMinutes(dto.startTime);
      let currentRuleEndMinutes=timeStringToMinutes(dto.endTime);
    for (let availabilityRule of weekDayAvailabilityRules) {
      const ruleStartMinutes = timeStringToMinutes(availabilityRule.startTime);
      const ruleEndMinutes = timeStringToMinutes(availabilityRule.endTime);

      if (
        ((currentRuleStartMinutes > ruleStartMinutes &&
          currentRuleStartMinutes < ruleEndMinutes) ||
          (currentRuleEndMinutes < ruleEndMinutes &&
            currentRuleEndMinutes > ruleStartMinutes))
      ) {
        throw new AppError(
          ERROR_MESSAGES.CONFLICTING_AVAILABILITY_RULE,
          AppErrorCodes.CONFLICT
        );
      }
    }

    await this._availabilityRuleRepository.create(avaialbilityRule);
  }
}
