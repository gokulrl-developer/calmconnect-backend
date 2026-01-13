import Session from "../../domain/entities/session.entity.js";
import { 
  PsychSessionSummaryFromPersistence, 
  PsychSessionTrendsEntry, 
  RecentSessionEntryFromPersistence, 
  RecentUserSessionEntryFromPersistence, 
  SessionTrendsEntry, 
  SessionTrendsSummary, 
  TopPsychologistsEntryFromPersistence, 
  UserSessionSummaryFromPersistence 
} from "../../domain/interfaces/ISessionRepository.js";
import { SessionTrendsEntry as ResponseSessionTrendsEntry } from "../../application/interfaces/ISessionTrendsUseCase.js";
import { 
  PsychSessionsSummary, 
  RecentSessionEntry, 
  PsychSessionsTrendEntry as ResponsePsychSessionTrendsEntry 
} from "../../application/interfaces/IFetchPsychDashboardUseCase.js";
import { CreateOrderDTO } from "../dtos/user.dto.js";
import { SessionDetailsInVideoCall } from "../interfaces/ICheckSessionAccessUseCase.js";
import { TopPsychologistResponse } from "../interfaces/IFetchTopPsychologistsUseCase.js";
import { SessionSummary as SessionSummaryResponse } from "../interfaces/IFetchDashboardSummaryCardsAdminUseCase.js";
import { UserRecentSessionsEntry, UserSessionSummary } from "../interfaces/IFetchUserDashboardUseCase.js";
import { SessionStatus } from "../../domain/enums/SessionStatus.js";

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
    SessionStatus.PENDING,
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
    sessionId: session.sessionId!,
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
    sessionId: session.sessionId!,
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
    sessionId: session.sessionId!,
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
    sessionId: session.sessionId!,
  };
};

export const toSessionTrendsResponse = (
  entry: SessionTrendsEntry
): ResponseSessionTrendsEntry => {
  return {
    label: entry.label,
    sessionCount: entry.sessionCount,
    cancelledSessionCount: entry.cancelledSessionCount ?? 0, 
  };
};

export const toTopPsychResponse = (
  entry: TopPsychologistsEntryFromPersistence
): TopPsychologistResponse => {
  return {
    psychId: entry.psychId,
    firstName: entry.firstName,
    lastName: entry.lastName,
    email: entry.email,
    sessionCount: entry.sessionCount,
    profilePicture:entry.profilePicture
  };
};

export const mapSessionTrendsSummaryToCardItem = (summary: SessionTrendsSummary): SessionSummaryResponse => ({
  totalSessionCount: summary.totalSessionCount,
  addedSessionCount: summary.addedSessionCount,
});

export const mapPsychSessionTrendsToResponse = (
  entry: PsychSessionTrendsEntry
):  ResponsePsychSessionTrendsEntry=> ({
  week: entry.week,
  sessionCount: entry.sessionCount,
});



export const mapRecentSessionsToResponse = (entry:RecentSessionEntryFromPersistence): RecentSessionEntry => ({
  sessionId: entry.sessionId!,
  firstName:entry.firstName,
  lastName:entry.lastName,
  profilePicture:entry.profilePicture,
  startTime: entry.startTime,
  status: entry.status as SessionStatus,
});


export const mapSessionSummaryToResponse = (
  summary: PsychSessionSummaryFromPersistence
):PsychSessionsSummary => ({
  todaySessionCount: summary.todaySessionCount,
  upcomingSessionCount: summary.upcomingSessionCount,
  nextSessionTime: summary.nextSessionTime
    ? summary.nextSessionTime.toISOString()
    : "N/A",
  totalSessionCount: summary.totalSessionCount,
  thisMonthSessionCount: summary.thisMonthSessionCount,
});

export const mapUserSessionSummaryFromPersistence = (
  data: UserSessionSummaryFromPersistence
): UserSessionSummary => ({
  totalSessionCount: data.totalSessionCount,
  completedSessionCount: data.completedSessionCount,
  upcomingSessionCount: data.upcomingSessionCount,
  cancelledSessionCount: data.cancelledSessionCount,
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
