import { Request, Response, NextFunction } from "express";
import IListPsychByUserUseCase from "../../../application/interfaces/IListPsychByUserUseCase";
import { StatusCodes } from "../../../utils/http-statuscodes";
import IPsychDetailsByUserUseCase, { PsychDetails } from "../../../application/interfaces/IPsychDetailsByUserUseCase";
import AppError from "../../../application/error/AppError";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants";
import { AppErrorCodes } from "../../../application/error/app-error-codes";



export default class AppointmentController{
    constructor(
        private readonly _listPsychByUserUseCase:IListPsychByUserUseCase,
        private readonly _psychDetailsUseCase:IPsychDetailsByUserUseCase,
    ){}
async listPsychologists(req:Request,res:Response,next:NextFunction):Promise<void>{  
    try{
      const result=await this._listPsychByUserUseCase.execute({
        ...req.query,
        skip:req.pagination?.skip!,
        limit:req.pagination?.limit!
      })
      res.status(StatusCodes.OK).json({...result})
    }catch(err){
        next(err);
    }

}

async psychDetails(req:Request,res:Response,next:NextFunction):Promise<void>{
    try{
    const psychId=req.query.psychId;
    const date=req.query.date;
     if(date && typeof date !== "string"){
        throw new AppError(ERROR_MESSAGES.DATE_INVALID_FORMAT,AppErrorCodes.VALIDATION_ERROR)
     }
     if(psychId && typeof psychId !== "string"){
        throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT,AppErrorCodes.VALIDATION_ERROR)
     }
    const result=await this._psychDetailsUseCase.execute({
        psychId:psychId!,
        date:date
    })

    res.status(StatusCodes.OK).json({...result})
}catch(error){
    next(error)
}   
}
}