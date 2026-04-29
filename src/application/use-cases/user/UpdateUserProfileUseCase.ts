import { UpdateUserProfileDTO } from "../../dtos/user.dto.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import { IFileStorageService } from "../../../domain/interfaces/IFileStorageService.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IUpdateUserProfileUseCase from "../../interfaces/IUpdateUserProfileUseCase.js";
import { toUserDomainFromUpdateDTO } from "../../mappers/UserMapper.js";
import { fileTypeFromBuffer, FileTypeResult } from "file-type";
import { ALLOWED_PROFILE_IMAGE_TYPES } from "../../constants/file-mime-types.constants.js";

export default class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _fileStorageService: IFileStorageService
    ) { }

    async execute(dto: UpdateUserProfileDTO): Promise<void> {
        const { userId, profilePicture } = dto;

        let profilePictureUrl: string | undefined = undefined;
        if (profilePicture && !(typeof profilePicture === "string")) {
            const fileType: FileTypeResult | undefined = await fileTypeFromBuffer(profilePicture);
            if (fileType === undefined || !ALLOWED_PROFILE_IMAGE_TYPES.includes(fileType.mime)) {
                throw new AppError(ERROR_MESSAGES.PROFILE_PICTURE_MIME_INVALID, AppErrorCodes.VALIDATION_ERROR)
            }
            profilePictureUrl = await this._fileStorageService.uploadFile(profilePicture, "profiles",fileType.mime);
        }

        const existingUser = await this._userRepository.findById(userId);
        if (!existingUser) {
            throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, AppErrorCodes.NOT_FOUND);
        }

        const updatedUser = toUserDomainFromUpdateDTO(existingUser, { ...dto, profilePictureUrl });

        const result = await this._userRepository.update(userId, updatedUser);
        if (!result) {
            throw new AppError(ERROR_MESSAGES.UPDATE_FAILED_SERVER_ERROR, AppErrorCodes.INTERNAL_ERROR);
        }
    }
}
