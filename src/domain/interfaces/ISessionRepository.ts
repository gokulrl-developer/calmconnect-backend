import Session from "../entities/session.entity";
import IBaseRepository from "./IBaseRepository";

export interface SessionTrendsEntry {
  label: string; //day/month
  sessions: number;
  cancelledSessions: number;
}

export default interface ISessionRepository extends IBaseRepository<Session> {
  findBookedSessions(date: Date, psychId: string): Promise<Session[]>;
  findSessionByPsychStartTime(
    startTime: Date,
    psychId: string
  ): Promise<Session | null>;
  listSessionsByUser(
    userId: string,
    status: string,
    skip: number,
    limit: number
  ): Promise<{ sessions: Session[]; totalItems: number }>;
  listSessionsByPsych(
    userId: string,
    status: string,
    skip: number,
    limit: number
  ): Promise<{ sessions: Session[]; totalItems: number }>;
  listSessionsByAdmin(
    status: string,
    skip: number,
    limit: number
  ): Promise<{ sessions: Session[]; totalItems: number }>;
  fetchSessionTrends(
    fromDate: Date,
    toDate: Date,
    interval: "day" | "month" | "year"
  ): Promise<SessionTrendsEntry[]>;
  findTopBySessionCount(
    fromDate: Date,
    toDate: Date,
    limit: number
  ): Promise<TopPsychologistsEntryFromPersistence[]>;
  fetchSessionTrendsSummary(
    fromDate: Date,
    toDate: Date
  ): Promise<SessionTrendsSummary>;
  fetchPsychSessionTrends(psychId: string): Promise<PsychSessionTrendsEntry[]>;

  fetchRecentSessionsByPsych(
    psychId: string
  ): Promise<RecentSessionEntryFromPersistence[]>;

  fetchSessionSummaryByPsych(
    psychId: string
  ): Promise<PsychSessionSummaryFromPersistence>;
  fetchUserSessionSummary(
    userId: string
  ): Promise<UserSessionSummaryFromPersistence>;

  fetchRecentUserSessionSummaries(
    userId: string,limit:number
  ): Promise<RecentUserSessionEntryFromPersistence[]>;
}

export interface TopPsychologistsEntryFromPersistence {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  sessionCount: number;
  profilePicture: string;
}

export interface SessionTrendsSummary {
  totalValue: number; // all time total count
  addedValue: number; // added value in this time range
}

export interface PsychSessionTrendsEntry {
  week: string;
  sessions: number;
}

export interface RecentSessionEntryFromPersistence {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  startTime: string;
  status: "scheduled" | "cancelled" | "ended" | "pending";
}

export interface PsychSessionSummaryFromPersistence {
  todaySessions: number;
  upcomingSessions: number;
  nextSessionTime: Date | null;
  totalSessions: number;
  thisMonthSessions: number;
}

export interface UserSessionSummaryFromPersistence {
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  cancelledSessions: number;
}

export interface RecentUserSessionEntryFromPersistence {
  sessionId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  startTime: string;
  status: "scheduled" | "cancelled" | "ended" | "pending";
}
