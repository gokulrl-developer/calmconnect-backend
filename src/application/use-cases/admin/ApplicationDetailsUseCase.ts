import { ApplicationDetailsDTO } from "../../dtos/admin.dto.js";
import IApplicationRepository from "../../../domain/interfaces/IApplicationRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IApplicationDetailsUseCase from "../../interfaces/IApplicationDetailsUseCase.js";
import { toApplicationDetails } from "../../mappers/ApplicationMapper.js";

export default class ApplicationDetailsUseCase implements IApplicationDetailsUseCase{
constructor(
private readonly _applicationRepository:IApplicationRepository
){}
async execute(dto:ApplicationDetailsDTO){
  const result =await this._applicationRepository.findApplicationById(dto.applicationId);
  if(!result){
    throw new AppError(ERROR_MESSAGES.APPLICATION_NOT_FOUND,AppErrorCodes.NOT_FOUND)
}
return toApplicationDetails(result)
}

}