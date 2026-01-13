import { FetchDashboardSummaryCardsDTO } from "../dtos/admin.dto.js";

export interface UserSummary{
    totalUserCount:number; // all time total
    addedUserCount:number; // added in the time range
}
export interface PsychSummary{
    totalPsychologistCount:number; // all time total
    addedPsychologistCount:number; // added in the time range
}
export interface SessionSummary{
    totalSessionCount:number; // all time total
    addedSessionCount:number; // added in the time range
}
export interface RevenueSummary{
    totalRevenue:number; // all time total
    addedRevenue:number; // added in the time range
}

export interface DashboardSummaryCardResponse{
    userSummary:UserSummary;
    psychologistSummary:PsychSummary;
    sessionSummary:SessionSummary;
    revenueSummary:RevenueSummary;
}
export default interface IFetchDashboardSummaryCardsAdminUseCase{
    execute(dto:FetchDashboardSummaryCardsDTO):Promise<DashboardSummaryCardResponse>
}