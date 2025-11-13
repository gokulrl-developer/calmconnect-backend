import IReviewRepository from "../../../domain/interfaces/IReviewRepository";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import ITransactionRepository from "../../../domain/interfaces/ITransactionRepository";
import { FetchPsychDashboardDTO } from "../../dtos/psych.dto";
import IFetchPsychDashboardUseCase, { PsychologistDashboardResponse } from "../../interfaces/IFetchPsychDashboardUseCase";
import { mapRatingSummaryToResponse } from "../../mappers/ReviewMapper";
import { mapPsychSessionTrendsToResponse, mapRecentSessionsToResponse, mapSessionSummaryToResponse } from "../../mappers/SessionMapper";
import { mapPsychRevenueTrendsToResponse, mapRevenueSummaryToResponse } from "../../mappers/TransactionMapper";

export default class FetchPsychDashboardUseCase implements IFetchPsychDashboardUseCase {
  constructor(
    private sessionRepository: ISessionRepository,
    private transactionRepository: ITransactionRepository,
    private reviewRepository: IReviewRepository,
  ) {}

  async execute(dto: FetchPsychDashboardDTO): Promise<PsychologistDashboardResponse> {
    const { psychId } = dto;

    const psychSessionTrends = await this.sessionRepository.fetchPsychSessionTrends(psychId);
    const sessionsTrend = psychSessionTrends.map(mapPsychSessionTrendsToResponse);

    const psychRevenueTrends = await this.transactionRepository.fetchPsychRevenueTrends(psychId);
    const revenueTrend = psychRevenueTrends.map(mapPsychRevenueTrendsToResponse);

    const recentSessionsRaw = await this.sessionRepository.fetchRecentSessionsByPsych(psychId);
    const recentSessions = recentSessionsRaw.map(mapRecentSessionsToResponse);

    const sessionSummary = await this.sessionRepository.fetchSessionSummaryByPsych(psychId);
    const sessionSummaryResponse = mapSessionSummaryToResponse(sessionSummary);

    const ratingSummary = await this.reviewRepository.fetchRatingSummaryByPsych(psychId);
    const ratingSummaryResponse = mapRatingSummaryToResponse(ratingSummary);

    const revenueSummary = await this.transactionRepository.fetchRevenueSummaryByPsych(psychId);
    const revenueSummaryResponse = mapRevenueSummaryToResponse(revenueSummary);

    const summary = {
      sessionSummary:{...sessionSummaryResponse},
      ratingSummary: ratingSummaryResponse,
      revenueSummary: revenueSummaryResponse,
    };

    return {
      summary,
      sessionsTrend,
      revenueTrend,
      recentSessions,
    };
  }
}
