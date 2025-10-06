import { UpdatePsychStatusDTO } from "../../dtos/admin.dto";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IUpdatePsychStatusUseCase from "../../interfaces/IUpdatePsychStatusUseCase";

export class UpdatePsychUseCase implements IUpdatePsychStatusUseCase {
constructor(private readonly _psychRepository: IPsychRepository) {}


async execute(dto: UpdatePsychStatusDTO): Promise<void> {
const psych = await this._psychRepository.findById(dto.applicationId);
if (!psych) throw new AppError(ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND,AppErrorCodes.NOT_FOUND);
psych.isBlocked = dto.status === 'inactive';
await this._psychRepository.update(dto.applicationId, psych);
}
}