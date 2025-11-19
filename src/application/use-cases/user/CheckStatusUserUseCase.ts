import { UserCheckStatusDTO } from "../../dtos/user.dto.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import ICheckStatusUserUseCase from "../../interfaces/ICheckStatusUserUseCase.js";

export class CheckStatusUserUseCase implements ICheckStatusUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository
) {}

  async execute(dto: UserCheckStatusDTO): Promise<void> {
    const user = await this._userRepository.findById(dto.id);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.ACCOUNT_BLOCKED,AppErrorCodes.BLOCKED);
    }

    if (user.isBlocked) {
      throw new AppError(ERROR_MESSAGES.ACCOUNT_LOGGED_OUT,AppErrorCodes.BLOCKED);
    }
  }
}
