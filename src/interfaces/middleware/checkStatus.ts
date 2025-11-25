// checkStatus.middleware.ts
import { Request, Response, NextFunction } from "express";
import ICheckStatusUserUseCase from "../../application/interfaces/ICheckStatusUserUseCase.js";
import ICheckStatusPsychUseCase from "../../application/interfaces/ICheckStatusPsychUseCase.js";
import AppError from "../../application/error/AppError.js";
import { AppErrorCodes } from "../../application/error/app-error-codes.js";
import { ERROR_MESSAGES } from "../../application/constants/error-messages.constants.js";

export class CheckStatusUser {
  constructor(
    private readonly _checkStatusUserUseCase: ICheckStatusUserUseCase) {}

  handle = async (req:Request, res: Response, next: NextFunction) => {
    try {
        if(!req.account){
             throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,AppErrorCodes.INTERNAL_ERROR)
            }
      await this._checkStatusUserUseCase.execute({ id: req.account.id });
      next();
    } catch (err) {
      next(err)
    }
  };
}

export class CheckStatusPsych {
  constructor(
    private readonly _checkStatusPsychUseCase: ICheckStatusPsychUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result=await this._checkStatusPsychUseCase.execute({ id: req.account!.id! });
      req.account!.isVerified=result.isVerified;
      next();
    } catch (err) {
      next(err)
    }
  };
}
