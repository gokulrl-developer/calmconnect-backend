export interface AdminData{
    email:string;
    adminId:string;
    password:string;
}

export default interface IAdminRepository{
 findOne():Promise<AdminData |null>,
 update(adminData:Partial<AdminData>):Promise<AdminData | null>
}