export interface AdminLoginDTO{
    email:string,
    password:string,
}

export interface ListApplicationsDTO{
    page:number,
    search:string |null,
}
export interface UpdateApplicationStatusDTO{
    applicationId:string,
    status:"pending" | "accepted" | "rejected",
    reason:string |null;
}

export interface ListUsersDTO{
    page:number,
    search:string |null,
    filter:"active"|"inactive"|null
}

export interface UpdateUserStatusDTO{
    applicationId:string,
    status:"active"|"inactive"
}

export interface ListPsychDTO{
    page:number,
    search:string |null,
    filter:"active"|"inactive"|null
}

export interface UpdatePsychStatusDTO{
    applicationId:string,
    status:"active"|"inactive"
}

export interface ApplicationDetailsDTO{
    applicationId:string
}

export interface SessionListingDTO{
  status:"scheduled"|"cancelled"|"ended"|"pending",
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
    status?:"pending"|"resolved";
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