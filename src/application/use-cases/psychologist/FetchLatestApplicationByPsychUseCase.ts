import IApplicationRepository from "../../../domain/interfaces/IApplicationRepository";
import { FetchLatestApplicationDTO } from "../../dtos/psych.dto";
import { toPsychApplicationResponse } from "../../mappers/ApplicationMapper";

export default class FetchLatestApplicationByPsychUseCase{
    constructor(
   private readonly _applicationRepository:IApplicationRepository
    ){}

    async execute(dto:FetchLatestApplicationDTO){
       const application=await this._applicationRepository.findLatestByPsychId(dto.psychId);
    return toPsychApplicationResponse(application) 
    }
}