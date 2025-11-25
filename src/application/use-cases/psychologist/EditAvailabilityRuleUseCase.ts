import { EditAvaialabilityRuleDTO } from "../../dtos/psych.dto.js";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository.js";
import IEditAvailabilityRuleUseCase from "../../interfaces/IEditAvailabilityRuleUseCase.js";
import { mapEditAvailabilityRuleDTOToDomain } from "../../mappers/AvailabilityRuleMapper.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import AvailabilityRule from "../../../domain/entities/availability-rule.entity.js";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository.js";
import {
  HHMMToIso,
  timeStringToMinutes,
} from "../../../utils/timeConverter.js";
import QuickSlot from "../../../domain/entities/quick-slot.entity.js";

export default class EditAvailabilityRuleUseCase
  implements IEditAvailabilityRuleUseCase
{
  constructor(
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository,
    private readonly _quickSlotRepo: IQuickSlotRepository
  ) {}

  async execute(dto: EditAvaialabilityRuleDTO): Promise<void> {
    const existingRule = await this._availabilityRuleRepository.findById(
      dto.availabilityRuleId
    );
    if (!existingRule) {
      throw new AppError(
        ERROR_MESSAGES.AVAILABILITY_RULE_NOT_FOUND,
        AppErrorCodes.NOT_FOUND
      );
    }
    if (existingRule.psychologist !== dto.psychId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORISED_ACTION,
        AppErrorCodes.FORBIDDEN_ERROR
      );
    }
    const updatedRule: AvailabilityRule = mapEditAvailabilityRuleDTOToDomain(
      dto,
      existingRule
    );
    const weekDayAvailabilityRules =
      await this._availabilityRuleRepository.findActiveByWeekDayPsych(
        updatedRule.weekDay,
        dto.psychId
      );
    const currentRuleStartMinutes = timeStringToMinutes(updatedRule.startTime);
    const currentRuleEndMinutes = timeStringToMinutes(updatedRule.endTime);
    for (const availabilityRule of weekDayAvailabilityRules) {
      if(availabilityRule.id===dto.availabilityRuleId){
        continue;
      }
      const ruleStartMinutes = timeStringToMinutes(availabilityRule.startTime);
      const ruleEndMinutes = timeStringToMinutes(availabilityRule.endTime);

      if (!((currentRuleStartMinutes >= ruleStartMinutes &&
          currentRuleStartMinutes >= ruleEndMinutes) ||
          (currentRuleEndMinutes <= ruleEndMinutes &&
            currentRuleEndMinutes <= ruleStartMinutes))) {
        throw new AppError(
          ERROR_MESSAGES.CONFLICTING_AVAILABILITY_RULE,
          AppErrorCodes.CONFLICT
        );
      }
    }
    const coveredQuickSlots =
      await this._quickSlotRepo.findActiveByWeekDayPsych(
        dto.psychId,
        existingRule.weekDay
      );
    const overlappingQuickSlots = coveredQuickSlots.filter(
      (quickSlot: QuickSlot) => {
        const ruleStartTime = new Date(
          HHMMToIso(updatedRule.startTime, quickSlot.date)
        );
        const ruleEndTime = new Date(
          HHMMToIso(updatedRule.endTime, quickSlot.date)
        );
        return !(
          (ruleStartTime < quickSlot.startTime &&
            ruleEndTime < quickSlot.startTime) ||
          (ruleStartTime > quickSlot.endTime && ruleEndTime > quickSlot.endTime)
        );
      }
    );
    if (overlappingQuickSlots.length > 0) {
      throw new AppError(
        ERROR_MESSAGES.CONFLICTING_QUICK_SLOT,
        AppErrorCodes.CONFLICT
      );
    }
    await this._availabilityRuleRepository.update(
      existingRule.id!,
      updatedRule
    );
  }
}
