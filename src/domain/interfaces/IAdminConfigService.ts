export interface AdminData{
    email:string,
    adminId:string
}
export default interface IAdminConfigService{
    getAdminData():AdminData
}