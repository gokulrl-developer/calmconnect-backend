import { ListUsersDTO } from "../dtos/admin.dto.js";

export default interface IUserListUseCase {
execute(dto: ListUsersDTO): Promise<any[]>;
}