import { UpdateUserStatusDTO } from "../../dtos/admin.dto.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IUpdateUserStatusUseCase from "../../interfaces/IUpdateUserStatusUseCase.js";
import { UserStatus } from "../../../domain/enums/UserStatus.js";

export class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
constructor(private readonly _userRepository: IUserRepository) {}


async execute(dto: UpdateUserStatusDTO): Promise<void> {
const user = await this._userRepository.findById(dto.applicationId);
if (!user) throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND,AppErrorCodes.NOT_FOUND);
user.isBlocked = dto.status === UserStatus.INACTIVE;
await this._userRepository.update(dto.applicationId, user);
}
}