import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import ITransactionRepository from "../../../domain/interfaces/ITransactionRepository";
import IComplaintRepository from "../../../domain/interfaces/IComplaintRepository";
import IFetchUserDashboardUseCase, {
  UserDashboardResponse,
} from "../../interfaces/IFetchUserDashboardUseCase";
import { FetchUserDashboardDTO } from "../../dtos/user.dto";
import { mapRecentUserSessionsFromPersistence, mapUserSessionSummaryFromPersistence } from "../../mappers/SessionMapper";
import { mapRecentUserTransactionsFromPersistence } from "../../mappers/TransactionMapper";
import { mapRecentUserComplaintsFromPersistence } from "../../mappers/ComplaintMapper";


export default class FetchUserDashboardUseCase
  implements IFetchUserDashboardUseCase
{
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly complaintRepository: IComplaintRepository
  ) {}

  async execute(dto: FetchUserDashboardDTO): Promise<UserDashboardResponse> {
    const { userId } = dto;

    const sessionSummaryFromPersistence =
      await this.sessionRepository.fetchUserSessionSummary(userId);
    const sessionSummary = mapUserSessionSummaryFromPersistence(
      sessionSummaryFromPersistence
    );

    const recentSessionsFromPersistence =
      await this.sessionRepository.fetchRecentUserSessionSummaries(userId,5);
    const recentSessions = recentSessionsFromPersistence.map(mapRecentUserSessionsFromPersistence);

    const recentTransactionsFromPersistence =
      await this.transactionRepository.fetchRecentUserTransactions(userId,5);
    const recentTransactions =recentTransactionsFromPersistence.map(mapRecentUserTransactionsFromPersistence)

    const recentComplaintsFromPersistence =
      await this.complaintRepository.fetchRecentUserComplaints(userId,5);
    const recentComplaints = recentComplaintsFromPersistence.map(mapRecentUserComplaintsFromPersistence)

    return {
      sessionSummary,
      recentSessions,
      recentTransactions,
      recentComplaints,
    };
  }
}
