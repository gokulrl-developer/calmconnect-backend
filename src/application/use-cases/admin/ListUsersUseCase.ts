import { ListUsersDTO } from "../../dtos/admin.dto";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import IUserListUseCase from "../../interfaces/IUserListUseCase";
import { toAdminUserListResponse } from "../../mappers/UserMapper";

export class UserListUseCase implements IUserListUseCase {
constructor(private readonly _userRepository: IUserRepository) {}


async execute(dto: ListUsersDTO): Promise<any[]> {
const users = await this._userRepository.findList(dto);
return users.map(user => toAdminUserListResponse(user));
}
}