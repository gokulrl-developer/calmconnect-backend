// checkStatus.middleware.ts
import { Request, Response, NextFunction } from "express";
import ICheckStatusUserUseCase from "../../application/interfaces/ICheckStatusUserUseCase.js";
import ICheckStatusPsychUseCase from "../../application/interfaces/ICheckStatusPsychUseCase.js";

export class CheckStatusUser {
  constructor(
    private readonly _checkStatusUserUseCase: ICheckStatusUserUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
       
      await this._checkStatusUserUseCase.execute({ id: req.account!.id });
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
