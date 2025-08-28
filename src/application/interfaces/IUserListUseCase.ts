import { ListUsersDTO } from "../../domain/dtos/admin.dto";

export default interface IUserListUseCase {
execute(dto: ListUsersDTO): Promise<any[]>;
}