import Session from "../../domain/entities/session.entity";
import { PsychSessionSummaryFromPersistence, PsychSessionTrendsEntry, RecentSessionEntryFromPersistence, RecentUserSessionEntryFromPersistence, SessionTrendsEntry, SessionTrendsSummary, TopPsychologistsEntryFromPersistence, UserSessionSummaryFromPersistence } from "../../domain/interfaces/ISessionRepository";
import { SessionTrendsEntry as ResponseSessionTrendsEntry } from "../../application/interfaces/ISessionTrendsUseCase";
import { PsychSessionsSummary, RecentSessionEntry, PsychSessionsTrendEntry as ResponsePsychSessionTrendsEntry } from "../../application/interfaces/IFetchPsychDashboardUseCase";
import { CreateOrderDTO } from "../dtos/user.dto";
import { SessionDetailsInVideoCall } from "../interfaces/ICheckSessionAccessUseCase";
import { TopPsychologistResponse } from "../interfaces/IFetchTopPsychologistsUseCase";
import { SummaryCardItem } from "../interfaces/IFetchDashboardSummaryCardsAdminUseCase";
import User from "../../domain/entities/user.entity";
import { UserRecentSessionsEntry, UserSessionSummary } from "../interfaces/IFetchUserDashboardUseCase";

export const mapCreateOrderDTOToDomain = (
  dto: CreateOrderDTO,
  startTime: Date,
  endTime: Date,
  duration: number,
  fees: number
) => {
  return new Session(
    dto.psychId,
    dto.userId,
    startTime,
    endTime,
    duration,
    [],
    "pending",
    fees
  );
};
export const toSessionListingUserResponse = (
  session: Session,
  psychFullName: string,
  psychEmail: string
) => {
  return {
    psychFullName: psychFullName,
    psychEmail: psychEmail,
    startTime: session.startTime,
    endTime: session.endTime,
    durationInMins: session.durationInMins,
    status: session.status,
    fees: session.fees,
    sessionId: session.id!,
  };
};
export const toSessionListingPsychResponse = (
  session: Session,
  userFullName: string,
  userEmail: string
) => {
  return {
    userFullName: userFullName,
    userEmail: userEmail,
    startTime: session.startTime,
    endTime: session.endTime,
    durationInMins: session.durationInMins,
    status: session.status,
    fees: session.fees,
    sessionId: session.id!,
  };
};
export const toSessionListingAdminResponse = (
  session: Session,
  psychFullName: string,
  userFullName: string,
  psychEmail: string,
  userEmail: string
) => {
  return {
    userFullName: userFullName,
    psychFullName: psychFullName,
    userEmail: userEmail,
    psychEmail: psychEmail,
    startTime: session.startTime,
    endTime: session.endTime,
    durationInMins: session.durationInMins,
    status: session.status,
    fees: session.fees,
    sessionId: session.id!,
  };
};

export const toSessionDetailsInVideoCall = (
  session: Session
): SessionDetailsInVideoCall => {
  return {
    psychologist: session.psychologist,
    user: session.user,
    startTime: session.startTime,
    endTime: session.endTime,
    durationInMins: session.durationInMins,
    sessionId: session.id!,
  };
};

export const toSessionTrendsResponse = (
  entry: SessionTrendsEntry
): ResponseSessionTrendsEntry => {
  return {
    label: entry.label,
    sessions: entry.sessions,
    cancelledSessions: entry.cancelledSessions ?? 0, 
  };
};

export const toTopPsychResponse = (
  entry: TopPsychologistsEntryFromPersistence
): TopPsychologistResponse => {
  return {
    id: entry.id,
    firstName: entry.firstName,
    lastName: entry.lastName,
    email: entry.email,
    sessionCount: entry.sessionCount,
    profilePicture:entry.profilePicture
  };
};

export const mapSessionTrendsSummaryToCardItem = (summary: SessionTrendsSummary): SummaryCardItem => ({
  totalValue: summary.totalValue,
  addedValue: summary.addedValue,
});

export const mapPsychSessionTrendsToResponse = (
  entry: PsychSessionTrendsEntry
):  ResponsePsychSessionTrendsEntry=> ({
  week: entry.week,
  sessions: entry.sessions,
});



export const mapRecentSessionsToResponse = (entry:RecentSessionEntryFromPersistence): RecentSessionEntry => ({
  id: entry.id!,
  firstName:entry.firstName,
  lastName:entry.lastName,
  profilePicture:entry.profilePicture,
  startTime: entry.startTime,
  status: entry.status as "scheduled" | "cancelled" | "ended" | "pending",
});


export const mapSessionSummaryToResponse = (
  summary: PsychSessionSummaryFromPersistence
):PsychSessionsSummary => ({
  todaySessions: summary.todaySessions,
  upcomingSessions: summary.upcomingSessions,
  nextSessionTime: summary.nextSessionTime
    ? summary.nextSessionTime.toISOString()
    : "N/A",
  totalSessions: summary.totalSessions,
  thisMonthSessions: summary.thisMonthSessions,
});

export const mapUserSessionSummaryFromPersistence = (
  data: UserSessionSummaryFromPersistence
): UserSessionSummary => ({
  totalSessions: data.totalSessions,
  completedSessions: data.completedSessions,
  upcomingSessions: data.upcomingSessions,
  cancelledSessions: data.cancelledSessions,
});

export const mapRecentUserSessionsFromPersistence = (
  entry: RecentUserSessionEntryFromPersistence
): UserRecentSessionsEntry =>{
  return{
    sessionId: entry.sessionId,
    firstName: entry.firstName,
    lastName: entry.lastName,
    profilePicture: entry.profilePicture,
    startTime: entry.startTime,
    status: entry.status,
  }};
