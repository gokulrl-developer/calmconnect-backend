import { SessionStatus } from "../../domain/enums/SessionStatus.js";
import { FetchPsychDashboardDTO } from "../dtos/psych.dto.js";

export interface DashboardSummary {
  sessionSummary: PsychSessionsSummary;
  ratingSummary: PsychRatingSummary;
  revenueSummary: PsychRevenueSummary;
}
export interface PsychSessionsSummary {
  todaySessionCount: number;
  upcomingSessionCount: number;
  nextSessionTime: string;
  totalSessionCount: number;
  thisMonthSessionCount: number;
}
export interface PsychRatingSummary {
  currentRating: number;
  lastMonthRating: number;
}
export interface PsychRevenueSummary {
  currentRevenue: number;
  lastMonthRevenue: number;
}

export interface PsychSessionsTrendEntry {
  week: string;
  sessionCount: number;
}

export interface RevenueTrendEntry {
  week: string;
  revenue: number;
}

export interface RecentSessionEntry {
  sessionId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  startTime: string;
  status: SessionStatus;
}

export interface PsychologistDashboardResponse {
  summary: DashboardSummary;
  sessionsTrend: PsychSessionsTrendEntry[];
  revenueTrend: RevenueTrendEntry[];
  recentSessions: RecentSessionEntry[];
}

export default interface IFetchPsychDashboardUseCase {
  execute(dto: FetchPsychDashboardDTO): Promise<PsychologistDashboardResponse>;
}
