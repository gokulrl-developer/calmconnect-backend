import { PsychApplicationStatusDTO } from "../../dtos/psych.dto";
import IApplicationRepository from "../../../domain/interfaces/IApplicationRepository";
import IApplicationStatusUseCase from "../../interfaces/IApplicationStatusUseCase";
import { toApplicationStatusResponse } from "../../mappers/ApplicationMapper";


export default class ApplicationStatusUseCase implements IApplicationStatusUseCase{
  constructor(
     private readonly _applicationRepository:IApplicationRepository,
  ){}
  async execute(dto:PsychApplicationStatusDTO){
     const application=await this._applicationRepository.findLatestByPsychId(dto.psychId);
     return toApplicationStatusResponse(application)
  }

}