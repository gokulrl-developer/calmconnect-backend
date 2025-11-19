import { FetchUserProfileDTO } from "../../dtos/user.dto.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IFetchUserProfileUseCase, { UserProfile } from "../../interfaces/IFetchUserProfileUseCase.js";
import { toFetchUserProfileResponse } from "../../mappers/UserMapper.js";

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
