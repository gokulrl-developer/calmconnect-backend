import { PsychApplicationStatusDTO } from "../../dtos/psych.dto.js";
import IApplicationRepository from "../../../domain/interfaces/IApplicationRepository.js";
import IFetchLatestApplicationUseCase from "../../interfaces/IFetchLatestApplicationUseCase.js";
import { toFetchLatestApplicationResponse } from "../../mappers/ApplicationMapper.js";

export default class FetchLatestApplicationUseCase implements IFetchLatestApplicationUseCase{
  constructor(
     private readonly _applicationRepository:IApplicationRepository,
  ){}
  async execute(dto:PsychApplicationStatusDTO){
     const application=await this._applicationRepository.findLatestByPsychId(dto.psychId);
     return {application:toFetchLatestApplicationResponse(application)}
  }

}