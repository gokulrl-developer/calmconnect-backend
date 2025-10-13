import { EditAvaialabilityRuleDTO } from "../../dtos/psych.dto";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import IEditAvailabilityRuleUseCase from "../../interfaces/IEditAvailabilityRuleUseCase";
import { mapEditAvailabilityRuleDTOToDomain } from "../../mappers/AvailabilityRuleMapper";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import AvailabilityRule from "../../../domain/entities/availability-rule.entity";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository";
import { HHMMToIso, isoToHHMM } from "../../../utils/timeConverter";
import QuickSlot from "../../../domain/entities/quick-slot.entity";

export default class EditAvailabilityRuleUseCase implements IEditAvailabilityRuleUseCase {
  constructor(
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository,
    private readonly _quickSlotRepo: IQuickSlotRepository
  ) {}

  async execute(dto: EditAvaialabilityRuleDTO): Promise<void> {
    const existingRule = await this._availabilityRuleRepository.findById(dto.availabilityRuleId);
    if (!existingRule) {
      throw new AppError(ERROR_MESSAGES.AVAILABILITY_RULE_NOT_FOUND, AppErrorCodes.NOT_FOUND);
    }
    if(existingRule.psychologist !==dto.psychId){
        throw new AppError(ERROR_MESSAGES.UNAUTHORISED_ACTION,AppErrorCodes.FORBIDDEN_ERROR)
    }
    const updatedRule: AvailabilityRule = mapEditAvailabilityRuleDTOToDomain(dto, existingRule);

    const coveredQuickSlots =
    await this._quickSlotRepo.findActiveByWeekDayPsych(
      dto.psychId,
      existingRule.weekDay
       );
    const overlappingQuickSlots=coveredQuickSlots.filter((quickSlot:QuickSlot)=>{
             const ruleStartTime=new Date(HHMMToIso(updatedRule.startTime,quickSlot.date));
             const ruleEndTime=new Date(HHMMToIso(updatedRule.endTime,quickSlot.date));
           return (!((ruleStartTime<quickSlot.startTime && ruleEndTime<quickSlot.startTime) || (ruleStartTime>quickSlot.endTime && ruleEndTime>quickSlot.endTime)))
    })
     if (overlappingQuickSlots.length > 0) {
       throw new AppError(
         ERROR_MESSAGES.CONFLICTING_QUICK_SLOT,
         AppErrorCodes.CONFLICT
        );
      }
    await this._availabilityRuleRepository.update(existingRule.id!, updatedRule);
  }
}
