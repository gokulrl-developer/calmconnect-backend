import User from "../../../domain/entities/user.entity";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { UserDetailsByAdminDTO } from "../../dtos/admin.dto";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IFetchUserDetailsByAdminUseCase, { AdminUserDetails } from "../../interfaces/IFetchUserDetailsByAdminUseCase";
import { mapDomainToDetailsResponseByAdmin } from "../../mappers/UserMapper";


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
