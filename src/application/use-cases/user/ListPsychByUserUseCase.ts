import { ListPsychByUserDTO } from "../../../domain/dtos/psych.dto";
import Psychologist from "../../../domain/entities/psychologist.entity";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IListPsychByUserUseCase from "../../interfaces/IListPsychByUserUseCase";
import { toPsychListByUserPersistence, toPsychListByUserResponse } from "../../mappers/PsychMapper";
import { calculatePagination } from "../../utils/calculatePagination";

export default class ListPsychByUserUseCase implements IListPsychByUserUseCase {
  constructor(private readonly _psychRepository: IPsychRepository) {}

  async execute(dto: ListPsychByUserDTO) {
    if (
      dto.sort &&
      dto.sort !== "a-z" &&
      dto.sort !== "z-a" &&
      dto.sort !== "rating" &&
      dto.sort !== "price"
    ) {
      throw new AppError(
        ERROR_MESSAGES.SORT_INVALID_FORMAT,
        AppErrorCodes.INVALID_INPUT
      );
    }
    let psychologistList = await this._psychRepository.listPsychByUser(
      toPsychListByUserPersistence(dto)
    );
    let psychologists=psychologistList.psychologists.map((psych:Psychologist)=>toPsychListByUserResponse(psych))
    let paginationData=calculatePagination(psychologistList.totalItems,dto.skip,dto.limit)
    return {psychologists,paginationData}
  }
}
