import Psychologist from "../../../domain/entities/psychologist.entity";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { PsychDetailsByAdminDTO } from "../../dtos/admin.dto";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IFetchpsychDetailsByAdminUseCase, {
  AdminPsychDetailsResponse,
} from "../../interfaces/IFetchPsychDetailsByAdminUseCase";
import { mapDomainToDetailsResponseByAdmin } from "../../mappers/PsychMapper";

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
