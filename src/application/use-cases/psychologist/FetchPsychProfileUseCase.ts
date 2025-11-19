import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import IFetchPsychProfileUseCase, { PsychProfile } from "../../interfaces/IFetchPsychProfileUseCase.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import { FetchPsychProfileDTO } from "../../dtos/psych.dto.js";
import { toFetchPsychProfileResponse } from "../../mappers/PsychMapper.js";

export default class FetchPsychProfileUseCase implements IFetchPsychProfileUseCase {
    constructor(
        private readonly _psychRepository: IPsychRepository
    ) {}

    async execute(dto: FetchPsychProfileDTO): Promise<PsychProfile> {
        const psych = await this._psychRepository.findById(dto.psychId);

        if (!psych) {
            throw new AppError(
                ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND,
                AppErrorCodes.NOT_FOUND
            );
        }

        return toFetchPsychProfileResponse(psych)
    }
}
