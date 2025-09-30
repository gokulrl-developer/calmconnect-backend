import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import IFetchPsychProfileUseCase, { PsychProfile } from "../../interfaces/IFetchPsychProfileUseCase";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import { FetchPsychProfileDTO } from "../../../domain/dtos/psych.dto";
import { toFetchPsychProfileResponse } from "../../mappers/PsychMapper";

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
