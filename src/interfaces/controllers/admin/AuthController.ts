import { Request, Response, NextFunction } from "express";
import { ILoginAdminUseCase } from "../../../application/interfaces/ILoginAdminUseCase";
import { StatusCodes } from "../../../utils/http-statuscodes";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants";

export default class AuthController {
  constructor(
    private _loginUseCase:ILoginAdminUseCase,
  ) {}

 async loginAdmin(req: Request<unknown, unknown, {email:string,password:string}>, res: Response,next:NextFunction): Promise<void> {
    try {
      const result = await this._loginUseCase.execute(req.body);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      path: '/refresh', 
    });
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 60 * 15 * 1000, 
      path: '/', 
    });
    
    res.status(StatusCodes.OK).json({success:true,message:SUCCESS_MESSAGES.ADMIN_LOGGED_IN});


    } catch (error) {
      next(error)
  }
}


}

