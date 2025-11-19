import express,{ NextFunction, Request, Response } from "express";
import { RefreshTokenController } from "../controllers/RefreshController.js";
import { LogoutController } from "../controllers/LogoutController.js";


const refreshController=new RefreshTokenController()
const logoutController=new LogoutController();

const router=express.Router()
router.post('/refresh',(req:Request,res:Response,next:NextFunction)=>refreshController.handle(req,res,next))
router.post('/logout',(req:Request,res:Response,next:NextFunction)=>logoutController.handle(req,res,next))

export default router;
