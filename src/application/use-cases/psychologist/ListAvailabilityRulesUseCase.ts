import IListAvailabilityRulesUseCase, { AvailabilityRuleSummary } from "../../interfaces/IListAvailabilityRulesUseCase.js";
import { ListAvailabilityRulesDTO } from "../../dtos/psych.dto.js";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository.js";
import { mapAvailabilityRulesToSummaries } from "../../mappers/AvailabilityRuleMapper.js";

export default class ListAvailabilityRulesUseCase implements IListAvailabilityRulesUseCase {
  constructor(
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository
  ) {}

  async execute(dto: ListAvailabilityRulesDTO): Promise<AvailabilityRuleSummary[]> {
    const availabilityRules = await this._availabilityRuleRepository.findAllActiveByPsychId(dto.psychId);

    const summaries = mapAvailabilityRulesToSummaries(availabilityRules);
    return summaries;
  }
}
