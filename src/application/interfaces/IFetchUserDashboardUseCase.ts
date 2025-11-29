import { ComplaintStatus } from "../../domain/enums/ComplaintStatus.js";
import { SessionStatus } from "../../domain/enums/SessionStatus.js";
import { TransactionReferenceType } from "../../domain/enums/TransactionReferenceType.js";
import { TransactionType } from "../../domain/enums/TransactionType.js";
import { FetchUserDashboardDTO } from "../dtos/user.dto.js";
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
    status:SessionStatus
}

export interface UserRecentTransactionsEntry{
    transactionId:string;
    time:string;
    type:TransactionType;
    referenceType?:TransactionReferenceType.BOOKING|TransactionReferenceType.REFUND;
    psychFirstName:string;
    psychLastName:string
}

export interface UserRecentComplaintsEntry{
    complaintId:string;
    psychFirstName:string;
    psychLastName:string;
    raisedTime:string;
    status:ComplaintStatus
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