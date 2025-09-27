import express,{ Request, Response, NextFunction } from "express";
import GoogleAuthUserUseCase from "../../application/use-cases/user/GoogleAuthUserUseCase";
import LoginUserUseCase from "../../application/use-cases/user/LoginUserUseCase";
import RegisterUserUseCase from "../../application/use-cases/user/RegisterUserUseCase";
import SignUpUserUseCase from "../../application/use-cases/user/SignUpUserUseCase";
import UserRepository from "../../infrastructure/database/repositories/UserRepository";
import RedisOtpRepository from "../../infrastructure/database/repositories/RedisOtpRepository";
import AuthController from "../controllers/user/AuthController";
import UserController from "../controllers/user/UserController";
import verifyTokenMiddleware from "../middleware/verifyTokenMiddleware";
import { authorizeRoles } from "../middleware/authorizeRolesMiddleware";
import { CheckStatusUser } from "../middleware/checkStatus";
import { CheckStatusUserUseCase } from "../../application/use-cases/user/CheckStatusUserUseCase";
import ResendOtpSignUpUserUseCase from "../../application/use-cases/user/ResendOtpSignUpUserUseCase";
import ResendOtpResetUserUseCase from "../../application/use-cases/user/ResendOtpResetUserUseCase";
import ForgotPasswordUserUseCase from "../../application/use-cases/user/ForgotPasswordUserUseCase";
import ResetPasswordUserUseCase from "../../application/use-cases/user/ResetPasswordUserUseCase";

const userRepository=new UserRepository()
const otpRepository=new RedisOtpRepository()

const registerUserUseCase=new RegisterUserUseCase(userRepository,otpRepository)
const signUpUseCase=new SignUpUserUseCase(userRepository,otpRepository)
const loginUseCase=new LoginUserUseCase(userRepository);
const googleAuthUseCase=new GoogleAuthUserUseCase(userRepository);
const resendOtpSignUpUseCase=new ResendOtpSignUpUserUseCase(otpRepository);
const resendOtpResetUseCase=new ResendOtpResetUserUseCase(otpRepository);
const checkStatusUserUseCase=new CheckStatusUserUseCase(userRepository)
const forgotPasswordUserUseCase=new ForgotPasswordUserUseCase(otpRepository,userRepository);
const resetPasswordUserUseCase=new ResetPasswordUserUseCase(userRepository,otpRepository)

const authController=new AuthController(registerUserUseCase,signUpUseCase,loginUseCase,googleAuthUseCase,resendOtpSignUpUseCase,
    resendOtpResetUseCase,forgotPasswordUserUseCase,resetPasswordUserUseCase
)

const userController=new UserController()
const checkStatusUser=new CheckStatusUser(checkStatusUserUseCase)

const router = express.Router();

router.post('/user/sign-up', (req:Request, res:Response,next:NextFunction) => authController.signUpUser(req, res,next));
router.post('/user/forgot-password', (req:Request, res:Response,next:NextFunction) => authController.forgotPassword(req, res,next));
router.post('/user/register',(req:Request, res:Response,next:NextFunction)=>authController.registerUser(req,res,next));
router.post('/user/reset-password',(req:Request, res:Response,next:NextFunction)=>authController.resetPassword(req,res,next));
router.post('/user/resend-otp-signup', (req:Request, res:Response,next:NextFunction) => authController.resendOtpSignUp(req, res,next));
router.post('/user/resend-otp-reset', (req:Request, res:Response,next:NextFunction) => authController.resendOtpReset(req, res,next));
router.post('/user/social',(req:Request, res:Response,next:NextFunction)=>authController.googleAuthUser(req,res,next))
router.post('/user/login',(req:Request,res:Response,next:NextFunction)=>authController.loginUser(req,res,next));
router.get('/user/dashboard',verifyTokenMiddleware,
                             authorizeRoles("user"),
                             checkStatusUser.handle.bind(checkStatusUser),
                             (req:Request,res:Response,next:NextFunction)=>userController.getDashboard(req,res,next))

export default router;