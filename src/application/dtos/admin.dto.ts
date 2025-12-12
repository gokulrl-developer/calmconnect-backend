import { ApplicationStatus } from "../../domain/enums/ApplicationStatus.js";
import { ComplaintStatus } from "../../domain/enums/ComplaintStatus.js";
import { PsychologistStatus } from "../../domain/enums/PsychologistStatus.js";
import { SessionStatus } from "../../domain/enums/SessionStatus.js";
import { UserStatus } from "../../domain/enums/UserStatus.js";

export interface AdminLoginDTO{
    email:string,
    password:string,
}

export interface ListApplicationsDTO{
    page:number,
    search:string |null,
    status?:ApplicationStatus
}
export interface UpdateApplicationStatusDTO{
    applicationId:string,
    status:ApplicationStatus,
    reason:string |null;
}

export interface ListUsersDTO{
    page:number,
    search:string |null,
    filter:UserStatus|null
}

export interface UpdateUserStatusDTO{
    applicationId:string,
    status:UserStatus
}

export interface ListPsychDTO{
    page:number,
    search:string |null,
    filter:PsychologistStatus|null
}

export interface UpdatePsychStatusDTO{
    applicationId:string,
    status:PsychologistStatus
}

export interface ApplicationDetailsDTO{
    applicationId:string
}

export interface SessionListingDTO{
  status:SessionStatus,
  skip:number,
  limit:number
}

export interface PsychDetailsByAdminDTO{
  psychId:string;
}

export interface UserDetailsByAdminDTO{
    userId:string
}

export interface ComplaintListingByAdminDTO{
    skip:number;
    limit:number;
    status?:ComplaintStatus;
    search?:string;
}

export interface ComplaintDetailsByAdminDTO{
    complaintId:string
}

export interface ComplaintResolutionDTO{
    complaintId:string;
    adminNotes:string;
}

export interface ComplaintSessionDetailsDTO{
    sessionId:string;
}

export interface ComplainthIstoryDTO{
    psychId:string;
    skip:number;
    limit:number
}

export interface FetchRevenueTrendsDTO{
    fromDate:string;
    toDate:string;
}
export interface FetchClientTrendsDTO{
    fromDate:string;
    toDate:string;
}
export interface FetchSessionTrendsDTO{
    fromDate:string;
    toDate:string;
}
export interface FetchTopPsychologistDTO{
    fromDate:string;
    toDate:string;
    limit:number;
}

export interface FetchDashboardSummaryCardsDTO{
    fromDate:string;
    toDate:string;
}