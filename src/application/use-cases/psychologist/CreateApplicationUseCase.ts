import { PsychApplicationDTO } from "../../dtos/psych.dto.js";
import Psychologist from "../../../domain/entities/psychologist.entity.js";
import IApplicationRepository from "../../../domain/interfaces/IApplicationRepository.js";
import { IFileStorageService } from "../../../domain/interfaces/IFileStorageService.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import ICreateApplicationUseCase from "../../interfaces/ICreateApplicationUseCase.js";
import { toApplicationDomainSubmit } from "../../mappers/ApplicationMapper.js";
import { IEventBus } from "../../interfaces/events/IEventBus.js";
import { EventMapEvents } from "../../../domain/enums/EventMapEvents.js";
import { ApplicationStatus } from "../../../domain/enums/ApplicationStatus.js";
import IAdminRepository from "../../../domain/interfaces/IAdminRepository.js";

export default class CreateApplicationUseCase implements ICreateApplicationUseCase{
  constructor(
     private readonly _applicationRepository:IApplicationRepository,
     private readonly _psychologistRepository:IPsychRepository,
     private readonly _fileStorageService:IFileStorageService,
     private readonly _adminRepository:IAdminRepository,
     private readonly _eventBus:IEventBus
  ){}
  async execute(dto:PsychApplicationDTO){
     const psychologist=await this._psychologistRepository.findById(dto.psychId) as Psychologist;
     const applications=await this._applicationRepository.findAllByPsychId(dto.psychId);
     if(applications.length>=3){
        throw new AppError(ERROR_MESSAGES.APPLICATION_LIMIT_EXCEEDED,AppErrorCodes.FORBIDDEN_ERROR)
     };
     for(const app of applications){
      if(app.status===ApplicationStatus.PENDING){
        throw new AppError(ERROR_MESSAGES.PENDING_APPLICATION_EXISTS,AppErrorCodes.FORBIDDEN_ERROR)
      }
      if(app.status===ApplicationStatus.ACCEPTED){
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
    await this._applicationRepository.create(applicationEntity);
    
    const adminData=await this._adminRepository.findOne();
        if(!adminData){
          throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,AppErrorCodes.INTERNAL_ERROR)
        }
    await this._eventBus.emit(EventMapEvents.APPLICATION_CREATED, {
      adminId:adminData.adminId,
      psychologistName:`${psychologist.firstName} ${psychologist.lastName}`,
      psychologistEmail:psychologist.email!,
    });
  }

}