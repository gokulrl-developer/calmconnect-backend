import { FetchPsychTrendsByAdminInterval } from "../../../domain/enums/FetchPsychTrendsByAdminInterval.js";
import { UserTrendsIntervalByAdmin } from "../../../domain/enums/UserTrendsIntervalByAdmin.js";
import IPsychRepository, {
  PsychTrendsEntry,
} from "../../../domain/interfaces/IPsychRepository.js";
import IUserRepository, {
  UserTrendsEntry,
} from "../../../domain/interfaces/IUserRepository.js";
import { FetchClientTrendsDTO } from "../../dtos/admin.dto.js";
import IFetchClientsTrendsUseCase, {
  ClientTrendsEntry,
} from "../../interfaces/IFetchClientTrendsUseCase.js";
import { generateLabels } from "../../utils/generateLabels.js";


export default class FetchClientsTrendsUseCase
  implements IFetchClientsTrendsUseCase
{
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _psychRepository: IPsychRepository
  ) {}

  async execute(dto: FetchClientTrendsDTO): Promise<ClientTrendsEntry[]> {
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
    const userEntries = await this._userRepository.fetchUserTrends(
      startDate,
      endDate,
      interval as UserTrendsIntervalByAdmin
    );
    const psychEntries = await this._psychRepository.fetchPsychTrends(
      startDate,
      endDate,
      interval as FetchPsychTrendsByAdminInterval
    );
        const labels = generateLabels(startDate, endDate, interval as "year"|"month"|"day");

    const filledUserEntries: UserTrendsEntry[] = labels.map((label) => {
      const existing = userEntries.find((entry) => entry.label === label);
      return existing || { label, users: 0 };
    });

    const filledPsychEntries: PsychTrendsEntry[] = labels.map((label) => {
      const existing = psychEntries.find((entry) => entry.label === label);
      return existing || { label, psychologists: 0 };
    });

    const finalEntries: ClientTrendsEntry[] = labels.map((label) => {
      const user = filledUserEntries.find((u) => u.label === label);
      const psych = filledPsychEntries.find((p) => p.label === label);
      return {
        label,
        users: user?.users ?? 0,
        psychologists: psych?.psychologists ?? 0,
      };
    });

    return finalEntries;
  }
}
