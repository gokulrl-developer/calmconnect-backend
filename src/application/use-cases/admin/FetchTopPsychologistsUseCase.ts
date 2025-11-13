import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import { FetchTopPsychologistDTO } from "../../dtos/admin.dto";
import  IFetchTopPsychologistsUseCase, { TopPsychologistResponse } from "../../interfaces/IFetchTopPsychologistsUseCase";
import { toTopPsychResponse } from "../../mappers/SessionMapper";

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
