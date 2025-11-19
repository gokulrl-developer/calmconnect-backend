import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository.js";
import ITransactionRepository from "../../../domain/interfaces/ITransactionRepository.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import { FetchDashboardSummaryCardsDTO } from "../../dtos/admin.dto.js";
import IFetchDashboardSummaryCardsAdminUseCase, { DashboardSummaryCardResponse } from "../../interfaces/IFetchDashboardSummaryCardsAdminUseCase.js";
import { mapPsychSummaryToCardItem } from "../../mappers/PsychMapper.js";
import { mapSessionTrendsSummaryToCardItem } from "../../mappers/SessionMapper.js";
import { mapRevenueSummaryToCardItem } from "../../mappers/TransactionMapper.js";
import { mapUserSummaryToCardItem } from "../../mappers/UserMapper.js";

export default class FetchDashboardSummaryCardsUseCase implements IFetchDashboardSummaryCardsAdminUseCase {
  constructor(
    private userRepo: IUserRepository,
    private psychRepo: IPsychRepository,
    private sessionRepo: ISessionRepository,
    private transactionRepo: ITransactionRepository
  ) {}

  async execute(dto: FetchDashboardSummaryCardsDTO): Promise<DashboardSummaryCardResponse> {
    const fromDate = new Date(dto.fromDate);
    const toDate = new Date(dto.toDate);
    
    const [userSummary, psychSummary, sessionSummary, revenueSummary] = await Promise.all([
      this.userRepo.fetchUserTrendsSummary(fromDate, toDate),
      this.psychRepo.fetchPsychSummary(fromDate, toDate),
      this.sessionRepo.fetchSessionTrendsSummary(fromDate, toDate),
      this.transactionRepo.fetchRevenueSummary(fromDate, toDate),
    ]);

    return {
      users: mapUserSummaryToCardItem(userSummary),
      psychologists: mapPsychSummaryToCardItem(psychSummary),
      sessions: mapSessionTrendsSummaryToCardItem(sessionSummary),
      revenue: mapRevenueSummaryToCardItem(revenueSummary),
    };
  }
}
