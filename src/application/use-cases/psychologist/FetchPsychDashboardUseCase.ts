import IReviewRepository from "../../../domain/interfaces/IReviewRepository.js";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository.js";
import ITransactionRepository from "../../../domain/interfaces/ITransactionRepository.js";
import { FetchPsychDashboardDTO } from "../../dtos/psych.dto.js";
import IFetchPsychDashboardUseCase, { PsychologistDashboardResponse } from "../../interfaces/IFetchPsychDashboardUseCase.js";
import { mapRatingSummaryToResponse } from "../../mappers/ReviewMapper.js";
import { mapPsychSessionTrendsToResponse, mapRecentSessionsToResponse, mapSessionSummaryToResponse } from "../../mappers/SessionMapper.js";
import { mapPsychRevenueTrendsToResponse, mapRevenueSummaryToResponse } from "../../mappers/TransactionMapper.js";

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
