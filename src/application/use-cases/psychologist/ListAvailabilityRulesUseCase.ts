import IListAvailabilityRulesUseCase, { AvailabilityRuleSummary } from "../../interfaces/IListAvailabilityRulesUseCase";
import { ListAvailabilityRulesDTO } from "../../dtos/psych.dto";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import { mapAvailabilityRulesToSummaries } from "../../mappers/AvailabilityRuleMapper";

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
