import { UpdatePsychProfileDTO } from "../../../domain/dtos/psych.dto";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import { IFileStorageService } from "../../../domain/interfaces/IFileStorageService";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IUpdatePsychProfileUseCase from "../../interfaces/IUpdatePsychProfileUseCase";
import Psychologist from "../../../domain/entities/psychologist.entity";
import { toPsychDomainFromUpdateDTO } from "../../mappers/PsychMapper";

export default class UpdatePsychProfileUseCase implements IUpdatePsychProfileUseCase {
    constructor(
        private readonly _psychRepository: IPsychRepository,
        private readonly _fileStorageService: IFileStorageService
    ) {}

    async execute(dto: UpdatePsychProfileDTO & { psychId: string }): Promise<void> {
        const { psychId, profilePicture, address, languages, specializations, bio, qualifications, hourlyFees, quickSlotHourlyFees } = dto;

        if (hourlyFees !== undefined && hourlyFees <= 0) {
            throw new AppError(ERROR_MESSAGES.INVALID_HOURLY_FEES, AppErrorCodes.VALIDATION_ERROR);
        }
        if (quickSlotHourlyFees !== undefined && quickSlotHourlyFees <= 0) {
            throw new AppError(ERROR_MESSAGES.INVALID_QUICK_SLOT_FEES, AppErrorCodes.VALIDATION_ERROR);
        }

        let profilePictureUrl: string | undefined = undefined;
        if (profilePicture && !(typeof profilePicture === "string")) {
            profilePictureUrl = await this._fileStorageService.uploadFile(profilePicture, "profiles");
        }

        const existingPsych = await this._psychRepository.findById(psychId);
        if (!existingPsych) {
            throw new AppError(ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND, AppErrorCodes.NOT_FOUND);
        }

        const updatedPsych = toPsychDomainFromUpdateDTO(existingPsych, { ...dto, profilePictureUrl });;
        
        const result = await this._psychRepository.update(psychId, updatedPsych);

        if (!result) {
            throw new AppError(ERROR_MESSAGES.UPDATE_FAILED_SERVER_ERROR, AppErrorCodes.INTERNAL_ERROR);
        }
    }
}
