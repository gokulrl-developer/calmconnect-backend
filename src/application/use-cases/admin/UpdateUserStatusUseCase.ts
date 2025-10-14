import { UpdateUserStatusDTO } from "../../dtos/admin.dto";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IUpdateUserStatusUseCase from "../../interfaces/IUpdateUserStatusUseCase";

export class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
constructor(private readonly _userRepository: IUserRepository) {}


async execute(dto: UpdateUserStatusDTO): Promise<void> {
const user = await this._userRepository.findById(dto.applicationId);
if (!user) throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND,AppErrorCodes.NOT_FOUND);
user.isBlocked = dto.status === 'inactive';
await this._userRepository.update(dto.applicationId, user);
}
}