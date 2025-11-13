import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import ITransactionRepository from "../../../domain/interfaces/ITransactionRepository";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import { FetchDashboardSummaryCardsDTO } from "../../dtos/admin.dto";
import IFetchDashboardSummaryCardsAdminUseCase, { DashboardSummaryCardResponse } from "../../interfaces/IFetchDashboardSummaryCardsAdminUseCase";
import { mapPsychSummaryToCardItem } from "../../mappers/PsychMapper";
import { mapSessionTrendsSummaryToCardItem } from "../../mappers/SessionMapper";
import { mapRevenueSummaryToCardItem } from "../../mappers/TransactionMapper";
import { mapUserSummaryToCardItem } from "../../mappers/UserMapper";


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
