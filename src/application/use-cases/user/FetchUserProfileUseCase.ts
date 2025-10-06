import { FetchUserProfileDTO } from "../../dtos/user.dto";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IFetchUserProfileUseCase, { UserProfile } from "../../interfaces/IFetchUserProfileUseCase";
import { toFetchUserProfileResponse } from "../../mappers/UserMapper";


export default class FetchUserProfileUseCase implements IFetchUserProfileUseCase {
  constructor(
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(dto: FetchUserProfileDTO): Promise<UserProfile> {
    const user = await this._userRepository.findById(dto.userId);

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        AppErrorCodes.NOT_FOUND
      );
    }

    return toFetchUserProfileResponse(user);
  }
}
