import { AdminLoginDTO } from "../../../domain/dtos/admin.dto";
import { adminConfig } from "../../../utils/adminConfig";
import { comparePasswords } from "../../../utils/passwordEncryption";
import { generateAccessToken, generateRefreshToken } from "../../../utils/tokenHandler";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { ROLES } from "../../constants/roles.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import { ILoginAdminUseCase } from "../../interfaces/ILoginAdminUseCase";



export interface AdminLoginResponse {
 accessToken:string,
 refreshToken:string
}

export default class LoginAdminUseCase implements ILoginAdminUseCase{
    constructor(
  ){}
 
 async execute(dto:AdminLoginDTO):Promise<AdminLoginResponse>{
       const {email,password}=dto;

    const {adminEmail,adminHashedPassword,adminId}=adminConfig;
    if(adminEmail !==email){
      throw new AppError(ERROR_MESSAGES.INVALID_EMAIL_PASSWORD,AppErrorCodes.INVALID_CREDENTIALS)
    }
    const isVerified=await comparePasswords(dto.password,adminHashedPassword);
    if(!isVerified){
      throw new AppError(ERROR_MESSAGES.INVALID_EMAIL_PASSWORD,AppErrorCodes.INVALID_CREDENTIALS)
    }
   const accessToken=await generateAccessToken({id:adminId,role:ROLES.ADMIN})
   const refreshToken=await generateRefreshToken({id:adminId,role:ROLES.ADMIN})
   return ({
    accessToken,
    refreshToken
   })
 }
}