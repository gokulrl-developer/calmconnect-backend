import { PsychApplicationDTO } from "../../dtos/psych.dto";
import Psychologist from "../../../domain/entities/psychologist.entity";
import IApplicationRepository from "../../../domain/interfaces/IApplicationRepository";
import { IFileStorageService } from "../../../domain/interfaces/IFileStorageService";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import ICreateApplicationUseCase from "../../interfaces/ICreateApplicationUseCase";
import { toApplicationDomainSubmit } from "../../mappers/ApplicationMapper";
import { IEventBus } from "../../interfaces/events/IEventBus";


export default class CreateApplicationUseCase implements ICreateApplicationUseCase{
  constructor(
     private readonly _applicationRepository:IApplicationRepository,
     private readonly _psychologistRepository:IPsychRepository,
     private readonly _fileStorageService:IFileStorageService,
     private readonly _eventBus:IEventBus
  ){}
  async execute(dto:PsychApplicationDTO){
     const psychologist=await this._psychologistRepository.findById(dto.psychId) as Psychologist;
     const applications=await this._applicationRepository.findAllByPsychId(dto.psychId);
     if(applications.length>=3){
        throw new AppError(ERROR_MESSAGES.APPLICATION_LIMIT_EXCEEDED,AppErrorCodes.FORBIDDEN_ERROR)
     };
     for(let app of applications){
      if(app.status==="pending"){
        throw new AppError(ERROR_MESSAGES.PENDING_APPLICATION_EXISTS,AppErrorCodes.FORBIDDEN_ERROR)
      }
      if(app.status==="accepted"){
        throw new AppError(ERROR_MESSAGES.ACCEPTED_APPLICATION_EXISTS,AppErrorCodes.FORBIDDEN_ERROR)
      }
     }
     let licenseUrl:string;
     let resume:string;
     let profilePicture:string;
     if(typeof dto.license !== "string"){
      licenseUrl = await this._fileStorageService.uploadFile(dto.license, "licenses");
    }else{
      licenseUrl=dto.license
    }
    if(typeof dto.resume !== "string"){
    resume = await this._fileStorageService.uploadFile(dto.resume, "resumes");
    }else{
      resume=dto.resume;
    }
    if(typeof dto.profilePicture !== "string"){
      profilePicture = await this._fileStorageService.uploadFile(dto.profilePicture, "profiles");
    }else{
      profilePicture=dto.profilePicture
    }
     const applicationEntity=toApplicationDomainSubmit(dto,psychologist,{licenseUrl,resume,profilePicture});
    const result= await this._applicationRepository.create(applicationEntity);
    await this._eventBus.emit('application.created', {
      adminId:dto.adminId,
      psychologistName:`${psychologist.firstName} ${psychologist.lastName}`,
      psychologistEmail:psychologist.email!,
    });
  }

}