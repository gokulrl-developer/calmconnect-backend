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
  status:string
}
