import ISessionRepository from "../../../domain/interfaces/ISessionRepository.js";
import { FetchTopPsychologistDTO } from "../../dtos/admin.dto.js";
import IFetchTopPsychologistsUseCase, { TopPsychologistResponse } from "../../interfaces/IFetchTopPsychologistsUseCase.js";
import { toTopPsychResponse } from "../../mappers/SessionMapper.js";

export default class FetchTopPsychologistsUseCase implements IFetchTopPsychologistsUseCase {
  constructor(
    private readonly _sessionRepository:ISessionRepository
  ) {}

  async execute(dto: FetchTopPsychologistDTO): Promise<TopPsychologistResponse[]> {
    const { fromDate, toDate,limit } = dto;
    

    const topPsychologists = await this._sessionRepository.findTopBySessionCount(new Date(fromDate),new Date(toDate), limit);

    return topPsychologists.map(toTopPsychResponse);
  }
}
