import { UserStatus } from "../../domain/enums/UserStatus.js";
import { ListUsersDTO } from "../dtos/admin.dto.js";

export interface AdminUserListResponseItem{
    id:string,
    email:string,
    firstName:string,
    lastName:string,
    status:UserStatus
}
export default interface IUserListUseCase {
execute(dto: ListUsersDTO): Promise<AdminUserListResponseItem[]>;
}