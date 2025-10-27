import { PsychApplicationStatusDTO } from "../../dtos/psych.dto";
import IApplicationRepository from "../../../domain/interfaces/IApplicationRepository";
import IFetchLatestApplicationUseCase from "../../interfaces/IFetchLatestApplicationUseCase";
import { toFetchLatestApplicationResponse } from "../../mappers/ApplicationMapper";


export default class FetchLatestApplicationUseCase implements IFetchLatestApplicationUseCase{
  constructor(
     private readonly _applicationRepository:IApplicationRepository,
  ){}
  async execute(dto:PsychApplicationStatusDTO){
     const application=await this._applicationRepository.findLatestByPsychId(dto.psychId);
     return {application:toFetchLatestApplicationResponse(application)}
  }

}