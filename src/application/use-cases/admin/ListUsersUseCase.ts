import { ListUsersDTO } from "../../dtos/admin.dto.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import IUserListUseCase, { AdminUserListResponseItem } from "../../interfaces/IUserListUseCase.js";
import { toAdminUserListResponse } from "../../mappers/UserMapper.js";

export class UserListUseCase implements IUserListUseCase {
constructor(private readonly _userRepository: IUserRepository) {}


async execute(dto: ListUsersDTO): Promise<AdminUserListResponseItem[]> {
const users = await this._userRepository.findList(dto);
return users.map(user => toAdminUserListResponse(user));
}
}