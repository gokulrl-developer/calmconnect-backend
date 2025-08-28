import { ApplicationDetailsDTO } from "../../../domain/dtos/admin.dto";
import IApplicationRepository from "../../../domain/interfaces/IApplicationRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IApplicationDetailsUseCase from "../../interfaces/IApplicationDetailsUseCase";
import { toApplicationDetails } from "../../mappers/ApplicationMapper";

export default class ApplicationDetailsUseCase implements IApplicationDetailsUseCase{
constructor(
private readonly _applicationRepository:IApplicationRepository
){}
async execute(dto:ApplicationDetailsDTO){
  const result =await this._applicationRepository.findPendingApplicationById(dto.applicationId);
  if(!result){
    throw new AppError(ERROR_MESSAGES.APPLICATION_NOT_FOUND,AppErrorCodes.NOT_FOUND)
}
return toApplicationDetails(result)
}

}