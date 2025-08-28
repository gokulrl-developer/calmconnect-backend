import { Request, Response, NextFunction } from "express";
import AppError from "../../../application/error/AppError";
import { AppErrorCodes } from "../../../application/error/app-error-codes";
import { StatusCodes } from "../../../utils/http-statuscodes";


export default class UserController{
    constructor(){}
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

}