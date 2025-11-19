import { FetchPsychDashboardDTO } from "../dtos/psych.dto.js";

export interface DashboardSummary {
  sessionSummary: PsychSessionsSummary;
  ratingSummary: PsychRatingSummary;
  revenueSummary: PsychRevenueSummary;
}
export interface PsychSessionsSummary {
  todaySessions: number;
  upcomingSessions: number;
  nextSessionTime: string;
  totalSessions: number;
  thisMonthSessions: number;
}
export interface PsychRatingSummary {
  current: number;
  lastMonth: number;
}
export interface PsychRevenueSummary {
  current: number;
  lastMonth: number;
}

export interface PsychSessionsTrendEntry {
  week: string;
  sessions: number;
}

export interface RevenueTrendEntry {
  week: string;
  revenue: number;
}

export interface RecentSessionEntry {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  startTime: string;
  status: "scheduled" | "cancelled" | "ended" | "pending";
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
