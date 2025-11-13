import { FetchSessionTrendsDTO } from "../../dtos/admin.dto";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository"; 
import IFetchSessionTrendsUseCase, { SessionTrendsEntry } from "../../interfaces/ISessionTrendsUseCase";
import { toSessionTrendsResponse } from "../../mappers/SessionMapper";
import { generateLabels } from "../../utils/generateLabels";

export default class FetchSessionTrendsUseCase implements IFetchSessionTrendsUseCase {
  constructor(
    private readonly _sessionRepository: ISessionRepository
  ) {}

  async execute(dto: FetchSessionTrendsDTO): Promise<SessionTrendsEntry[]> {
    let interval: string;
    const startDate = new Date(dto.fromDate);
    const endDate = new Date(dto.toDate);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const diffMonths = diffDays / 30; 
    const diffYears = diffMonths / 12;

    if (diffYears > 1) {
      interval = "year";
    } else if (diffMonths > 1) {
      interval = "month";
    } else {
      interval = "day";
    }
    const entries = await this._sessionRepository.fetchSessionTrends(startDate, endDate,interval as "day"|"month"|"year");
    const labels = generateLabels(startDate, endDate, interval as "year"|"month"|"day");

    const filledEntries: SessionTrendsEntry[] = labels.map(label => {
      const found = entries.find(e => e.label === label);
      return found ?? { label, sessions: 0, cancelledSessions: 0 };
    });

    return filledEntries.map(toSessionTrendsResponse);
  }
}
