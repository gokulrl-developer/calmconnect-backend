import Session from "../entities/session.entity.js";
import { SessionStatus } from "../enums/SessionStatus.js";
import { SessionTrendsByAdminInterval } from "../enums/SessionTrendsByAdminInterval.js";
import IBaseRepository from "./IBaseRepository.js";

export interface SessionTrendsEntry {
  label: string; //day/month
  sessionCount: number;
  cancelledSessionCount: number;
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
  ): Promise<{ sessions: Session[]; totalItemCount: number }>;
  listSessionsByPsych(
    userId: string,
    status: string,
    skip: number,
    limit: number
  ): Promise<{ sessions: Session[]; totalItemCount: number }>;
  listSessionsByAdmin(
    status: string,
    skip: number,
    limit: number
  ): Promise<{ sessions: Session[]; totalItemCount: number }>;
  fetchSessionTrends(
    fromDate: Date,
    toDate: Date,
    interval: SessionTrendsByAdminInterval
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
  psychId: string;
  firstName: string;
  lastName: string;
  email: string;
  sessionCount: number;
  profilePicture: string;
}

export interface SessionTrendsSummary {
  totalSessionCount: number; // all time total count
  addedSessionCount: number; // added value in this time range
}

export interface PsychSessionTrendsEntry {
  week: string;
  sessionCount: number;
}

export interface RecentSessionEntryFromPersistence {
  sessionId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  startTime: string;
  status: SessionStatus;
}

export interface PsychSessionSummaryFromPersistence {
  todaySessionCount: number;
  upcomingSessionCount: number;
  nextSessionTime: Date | null;
  totalSessionCount: number;
  thisMonthSessionCount: number;
}

export interface UserSessionSummaryFromPersistence {
  totalSessionCount: number;
  completedSessionCount: number;
  upcomingSessionCount: number;
  cancelledSessionCount: number;
}

export interface RecentUserSessionEntryFromPersistence {
  sessionId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  startTime: string;
  status: SessionStatus;
}
