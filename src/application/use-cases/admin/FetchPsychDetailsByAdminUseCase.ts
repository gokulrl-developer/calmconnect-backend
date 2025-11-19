import Psychologist from "../../../domain/entities/psychologist.entity.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { PsychDetailsByAdminDTO } from "../../dtos/admin.dto.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IFetchpsychDetailsByAdminUseCase, {
  AdminPsychDetailsResponse,
} from "../../interfaces/IFetchPsychDetailsByAdminUseCase.js";
import { mapDomainToDetailsResponseByAdmin } from "../../mappers/PsychMapper.js";

export class FetchPsychDetailsByAdminUseCase
  implements IFetchpsychDetailsByAdminUseCase
{
  constructor(private _psychRepository: IPsychRepository) {}

  async execute(dto: PsychDetailsByAdminDTO): Promise<AdminPsychDetailsResponse> {
    const psych: Psychologist | null = await this._psychRepository.findById(
      dto.psychId
    );

    if (!psych) {
      throw new AppError(
        ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND,
        AppErrorCodes.NOT_FOUND
      );
    }

    const response: AdminPsychDetailsResponse =
      mapDomainToDetailsResponseByAdmin(psych);

    return response;
  }
}
