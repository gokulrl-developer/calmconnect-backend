import { Request, Response, NextFunction } from "express";
import AppError from "../../../application/error/AppError";
import { AppErrorCodes } from "../../../application/error/app-error-codes";
import { StatusCodes } from "../../../utils/http-statuscodes";
import IFetchUserProfileUseCase from "../../../application/interfaces/IFetchUserProfileUseCase";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants";
import IUpdateUserProfileUseCase from "../../../application/interfaces/IUpdateUserProfileUseCase";


export default class UserController{
    constructor(
      private readonly _fetchUserProfileUseCase:IFetchUserProfileUseCase,
      private readonly _updateUserProfileUseCase:IUpdateUserProfileUseCase
    ){}
async getDashboard(req:Request,res:Response,next:NextFunction):Promise<void>{
   
    try{
      if(!req.account){
        throw new AppError("Login to continue",AppErrorCodes.FORBIDDEN_ERROR)
      }
      const {id,role}=req.account;
      res.status(StatusCodes.OK).json({user:{id,role}})
    }catch(err){
        next(err);
    }
}

  async fetchProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req?.account?.id;
            const userProfile = await this._fetchUserProfileUseCase.execute({ userId: userId! });

            res.status(StatusCodes.OK).json({ profile: userProfile });
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const { address } = req.body;

      if (address !== undefined && typeof address.trim() !== "string") {
        throw new AppError(
          ERROR_MESSAGES.ADDRESS_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      let profilePicture: string | Buffer | undefined;
      if (files?.profilePicture?.[0]) {
        const file = files.profilePicture[0];
        if (!(file.buffer instanceof Buffer)) {
          throw new AppError(
            ERROR_MESSAGES.PROFILE_PICTURE_REQUIRED,
            AppErrorCodes.VALIDATION_ERROR
          );
        }
        profilePicture = file.buffer;
      }

      await this._updateUserProfileUseCase.execute({
        userId: req?.account?.id!,
        address,
        profilePicture,
      });

      res.status(StatusCodes.OK).json({
        message: SUCCESS_MESSAGES.PROFILE_UPDATED,
      });
    } catch (error) {
      next(error);
    }
  }
}