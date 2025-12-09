import { AdminLoginDTO } from "../../dtos/admin.dto.js";
import { comparePasswords } from "../../../utils/passwordEncryption.js";
import { generateAccessToken, generateRefreshToken } from "../../../utils/tokenHandler.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { ROLES } from "../../constants/roles.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import { ILoginAdminUseCase } from "../../interfaces/ILoginAdminUseCase.js";
import AdminRepository from "../../../infrastructure/database/repositories/AdminRepository.js";

export interface AdminLoginResponse {
 accessToken:string,
 refreshToken:string
}

export default class LoginAdminUseCase implements ILoginAdminUseCase{
    constructor(
      private _adminRepository:AdminRepository
  ){}
 
 async execute(dto:AdminLoginDTO):Promise<AdminLoginResponse>{
       const {email}=dto;

   const adminData=await this._adminRepository.findOne();
       if(!adminData){
         throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,AppErrorCodes.INTERNAL_ERROR)
       }
    if(adminData.email !==email){
      throw new AppError(ERROR_MESSAGES.INVALID_EMAIL_PASSWORD,AppErrorCodes.INVALID_CREDENTIALS)
    }
    const isVerified=await comparePasswords(dto.password,adminData.password);
    if(!isVerified){
      throw new AppError(ERROR_MESSAGES.INVALID_EMAIL_PASSWORD,AppErrorCodes.INVALID_CREDENTIALS)
    }
   const accessToken=await generateAccessToken({id:adminData.adminId,role:ROLES.ADMIN})
   const refreshToken=await generateRefreshToken({id:adminData.adminId,role:ROLES.ADMIN})
   return ({
    accessToken,
    refreshToken
   })
 }
}