import { ListUsersDTO } from "../dtos/admin.dto.js";

export interface AdminUserListResponseItem{
    id:string,
    email:string,
    firstName:string,
    lastName:string,
    status:"active"|"inactive"
}
export default interface IUserListUseCase {
execute(dto: ListUsersDTO): Promise<AdminUserListResponseItem[]>;
}