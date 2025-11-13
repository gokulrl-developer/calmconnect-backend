import { FetchUserDashboardDTO } from "../dtos/user.dto";
export interface UserSessionSummary{
    totalSessions:number;
    completedSessions:number;
    upcomingSessions:number;
    cancelledSessions:number;
}

export interface UserRecentSessionsEntry{
    sessionId:string;
    firstName:string;
    lastName:string;
    profilePicture:string;
    startTime: string;
    status:"scheduled"|"cancelled"|"ended"|"pending"
}

export interface UserRecentTransactionsEntry{
    transactionId:string;
    time:string;
    type:"credit"|"debit";
    referenceType?:"booking"|"refund";
    psychFirstName:string;
    psychLastName:string
}

export interface UserRecentComplaintsEntry{
    complaintId:string;
    psychFirstName:string;
    psychLastName:string;
    raisedTime:string;
    status:"pending"|"resolved"
}
export interface UserDashboardResponse{
    sessionSummary:UserSessionSummary,
    recentSessions:UserRecentSessionsEntry[],
    recentTransactions:UserRecentTransactionsEntry[],
    recentComplaints:UserRecentComplaintsEntry[]
}
export default interface IFetchUserDashboardUseCase{
    execute(dto:FetchUserDashboardDTO):Promise<UserDashboardResponse>
}