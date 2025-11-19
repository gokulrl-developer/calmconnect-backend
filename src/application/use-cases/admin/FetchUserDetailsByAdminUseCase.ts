import User from "../../../domain/entities/user.entity.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { UserDetailsByAdminDTO } from "../../dtos/admin.dto.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IFetchUserDetailsByAdminUseCase, { AdminUserDetails } from "../../interfaces/IFetchUserDetailsByAdminUseCase.js";
import { mapDomainToDetailsResponseByAdmin } from "../../mappers/UserMapper.js";

export class FetchUserDetailsByAdminUseCase
  implements IFetchUserDetailsByAdminUseCase
{
  constructor(private _userRepository: IUserRepository) {}

  async execute(dto: UserDetailsByAdminDTO): Promise<AdminUserDetails> {
    const user: User | null = await this._userRepository.findById(dto.userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND,AppErrorCodes.NOT_FOUND);
    }

    const response: AdminUserDetails = mapDomainToDetailsResponseByAdmin(user);

    return response;
  }
}
