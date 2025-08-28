import { UserCheckStatusDTO } from "../../../domain/dtos/user.dto";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import ICheckStatusUserUseCase from "../../interfaces/ICheckStatusUserUseCase";


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
