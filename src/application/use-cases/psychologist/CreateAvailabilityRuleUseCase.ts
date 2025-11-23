import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository.js";
import { timeStringToMinutes } from "../../../utils/timeConverter.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { CreateAvaialabilityRuleDTO } from "../../dtos/psych.dto.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import ICreateAvailabilityRuleUseCase from "../../interfaces/ICreateAvailabilityRuleUseCase.js";
import { mapCreateAvailabilityRuleDTOToDomain } from "../../mappers/AvailabilityRuleMapper.js";

export default class CreateAvailabilityRuleUseCase
  implements ICreateAvailabilityRuleUseCase
{
  constructor(
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository
  ) {}
  async execute(dto: CreateAvaialabilityRuleDTO) {
    console.log("use case dto",dto)
    const avaialbilityRule = mapCreateAvailabilityRuleDTOToDomain(dto);
    const weekDayAvailabilityRules =
      await this._availabilityRuleRepository.findActiveByWeekDayPsych(
        dto.weekDay,
        dto.psychId
      );
      console.log("use case fetched rules",weekDayAvailabilityRules)
      const currentRuleStartMinutes=timeStringToMinutes(dto.startTime);
      const currentRuleEndMinutes=timeStringToMinutes(dto.endTime);
    for (const availabilityRule of weekDayAvailabilityRules) {
      const ruleStartMinutes = timeStringToMinutes(availabilityRule.startTime);
      const ruleEndMinutes = timeStringToMinutes(availabilityRule.endTime);

      if (
        ((currentRuleStartMinutes > ruleStartMinutes &&
          currentRuleStartMinutes < ruleEndMinutes) ||
          (currentRuleEndMinutes < ruleEndMinutes &&
            currentRuleEndMinutes > ruleStartMinutes)||
          (ruleStartMinutes > currentRuleStartMinutes &&
          ruleStartMinutes < currentRuleEndMinutes)||
          (ruleEndMinutes < currentRuleEndMinutes &&
            ruleEndMinutes > currentRuleStartMinutes) )
      ) {
        throw new AppError(
          ERROR_MESSAGES.CONFLICTING_AVAILABILITY_RULE,
          AppErrorCodes.OVERLAPPING_AVAILABILITY_RULE
        );
      }
    }

    await this._availabilityRuleRepository.create(avaialbilityRule);
  }
}
