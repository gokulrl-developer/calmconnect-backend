import express,{ NextFunction, Request, Response } from "express";
import { RefreshTokenController } from "../controllers/RefreshController.js";
import { LogoutController } from "../controllers/LogoutController.js";
import { SHARED_ROUTES } from "../constants/shared-routes.constants.js";


const refreshController=new RefreshTokenController()
const logoutController=new LogoutController();

const router=express.Router()
router.post(SHARED_ROUTES.REFRESH,(req:Request,res:Response,next:NextFunction)=>refreshController.handle(req,res,next))
router.post(SHARED_ROUTES.LOGOUT,(req:Request,res:Response,next:NextFunction)=>logoutController.handle(req,res,next))

export default router;
