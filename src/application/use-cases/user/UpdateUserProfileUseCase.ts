import { UpdateUserProfileDTO } from "../../../domain/dtos/user.dto";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import { IFileStorageService } from "../../../domain/interfaces/IFileStorageService";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IUpdateUserProfileUseCase from "../../interfaces/IUpdateUserProfileUseCase";
import { toUserDomainFromUpdateDTO } from "../../mappers/UserMapper";

export default class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _fileStorageService: IFileStorageService
    ) {}

    async execute(dto: UpdateUserProfileDTO): Promise<void> {
        const { userId, profilePicture, address } = dto;

        let profilePictureUrl: string | undefined = undefined;
        if (profilePicture && !(typeof profilePicture === "string")) {
            profilePictureUrl = await this._fileStorageService.uploadFile(profilePicture, "profiles");
        }

        const existingUser = await this._userRepository.findById(userId);
        if (!existingUser) {
            throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, AppErrorCodes.NOT_FOUND);
        }

        const updatedUser = toUserDomainFromUpdateDTO(existingUser, { address, profilePictureUrl });

        const result = await this._userRepository.update(userId, updatedUser);
        if (!result) {
            throw new AppError(ERROR_MESSAGES.UPDATE_FAILED_SERVER_ERROR, AppErrorCodes.INTERNAL_ERROR);
        }
    }
}
