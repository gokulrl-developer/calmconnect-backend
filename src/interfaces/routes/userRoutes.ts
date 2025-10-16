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
import PsychDetailsByUserUseCase from "../../application/use-cases/user/PsychDetailsByUserUseCase";
import ListPsychByUserUseCase from "../../application/use-cases/user/ListPsychByUserUseCase";
import PsychRepository from "../../infrastructure/database/repositories/PsychRepository";
import AvailabilityRuleRepository from "../../infrastructure/database/repositories/AvailabilityRuleRepository";
import SessionRepository from "../../infrastructure/database/repositories/SessionRepository";
import AppointmentController from "../controllers/user/AppointmentController";
import { paginationMiddleware } from "../middleware/paginationMiddleware";
import FetchUserProfileUseCase from "../../application/use-cases/user/FetchUserProfileUseCase";
import UpdateUserProfileUseCase from "../../application/use-cases/user/UpdateUserProfileUseCase";
import CloudinaryService from "../../infrastructure/external/CloudinaryService";
import FetchCheckoutDataUseCase from "../../application/use-cases/user/FetchCheckoutDataUseCase";
import CreateOrderUseCase from "../../application/use-cases/user/CreateOrderUseCase";
import RazorpayPaymentProvider from "../../infrastructure/external/RazorpayPaymentProvider";
import VerifyPaymentUseCase from "../../application/use-cases/user/VerifyPaymentUseCase";
import WalletRepository from "../../infrastructure/database/repositories/WalletRepository";
import TransactionRepository from "../../infrastructure/database/repositories/TransactionRepository";
import { upload } from "../../infrastructure/config/multerConfig";
import SessionController from "../controllers/user/SessionController";
import SessionListingUserUseCase from "../../application/use-cases/user/SessionListingUserUseCase";
import SpecialDayRepository from "../../infrastructure/database/repositories/SpecialDayRepository";
import QuickSlotRepository from "../../infrastructure/database/repositories/QuickSlotRepository";
import CancelSessionUserUseCase from "../../application/use-cases/user/CancelSessionUserUseCase";

const userRepository=new UserRepository()
const otpRepository=new RedisOtpRepository()
const psychRepository=new PsychRepository()
const availabilityRuleRepository=new AvailabilityRuleRepository()
const specialDayRepository=new SpecialDayRepository()
const quickSlotRepository=new QuickSlotRepository()
const sessionRepository=new SessionRepository()
const cloudinaryService=new CloudinaryService()
const paymentProvider=new RazorpayPaymentProvider()
const walletRepository=new WalletRepository()
const transactionRepository=new TransactionRepository()

const registerUserUseCase=new RegisterUserUseCase(userRepository,otpRepository)
const signUpUseCase=new SignUpUserUseCase(userRepository,otpRepository)
const loginUseCase=new LoginUserUseCase(userRepository);
const googleAuthUseCase=new GoogleAuthUserUseCase(userRepository);
const resendOtpSignUpUseCase=new ResendOtpSignUpUserUseCase(otpRepository);
const resendOtpResetUseCase=new ResendOtpResetUserUseCase(otpRepository);
const checkStatusUserUseCase=new CheckStatusUserUseCase(userRepository)
const forgotPasswordUserUseCase=new ForgotPasswordUserUseCase(otpRepository,userRepository);
const resetPasswordUserUseCase=new ResetPasswordUserUseCase(userRepository,otpRepository);
const listPsychByUserUseCase=new ListPsychByUserUseCase(psychRepository,availabilityRuleRepository,specialDayRepository,quickSlotRepository,sessionRepository);
const psychDetailsByUserUseCase=new PsychDetailsByUserUseCase(psychRepository,availabilityRuleRepository,specialDayRepository,quickSlotRepository,sessionRepository)
const fetchProfileUseCase=new FetchUserProfileUseCase(userRepository);
const updateProfileUseCase=new UpdateUserProfileUseCase(userRepository,cloudinaryService)
const fetchCheckoutDataUseCase=new FetchCheckoutDataUseCase(psychRepository,availabilityRuleRepository,specialDayRepository,quickSlotRepository,sessionRepository)
const createOrderUseCase=new CreateOrderUseCase(psychRepository,availabilityRuleRepository,specialDayRepository,quickSlotRepository,sessionRepository,paymentProvider)
const verifyPaymentUseCase=new VerifyPaymentUseCase(paymentProvider,sessionRepository,transactionRepository,walletRepository)
const listSessionsByUserUseCase=new SessionListingUserUseCase(sessionRepository,psychRepository)
const cancelSessionUseCase=new CancelSessionUserUseCase(sessionRepository,transactionRepository,walletRepository);

const authController=new AuthController(registerUserUseCase,signUpUseCase,loginUseCase,googleAuthUseCase,resendOtpSignUpUseCase,
    resendOtpResetUseCase,forgotPasswordUserUseCase,resetPasswordUserUseCase
);
const appointmentController=new AppointmentController(listPsychByUserUseCase,psychDetailsByUserUseCase,fetchCheckoutDataUseCase,createOrderUseCase,verifyPaymentUseCase)
const sessionController=new SessionController(listSessionsByUserUseCase,cancelSessionUseCase)
const userController=new UserController(fetchProfileUseCase,updateProfileUseCase)
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
                             (req:Request,res:Response,next:NextFunction)=>userController.getDashboard(req,res,next));
router.get('/user/psychologists',verifyTokenMiddleware,
                             authorizeRoles("user"),
                             checkStatusUser.handle.bind(checkStatusUser),
                             paginationMiddleware,
                             (req:Request,res:Response,next:NextFunction)=>appointmentController.listPsychologists(req,res,next))
router.get('/user/psychologist-details',verifyTokenMiddleware,
                             authorizeRoles("user"),
                             checkStatusUser.handle.bind(checkStatusUser),
                             (req:Request,res:Response,next:NextFunction)=>appointmentController.psychDetails(req,res,next))
router.get('/user/checkout',verifyTokenMiddleware,
                             authorizeRoles("user"),
                             checkStatusUser.handle.bind(checkStatusUser),
                             (req:Request,res:Response,next:NextFunction)=>appointmentController.fetchCheckoutData(req,res,next))
router.post('/user/create-order',verifyTokenMiddleware,
                             authorizeRoles("user"),
                             checkStatusUser.handle.bind(checkStatusUser),
                             (req:Request,res:Response,next:NextFunction)=>appointmentController.createOrder(req,res,next))
router.post('/user/verify-payment',verifyTokenMiddleware,
                             authorizeRoles("user"),
                             checkStatusUser.handle.bind(checkStatusUser),
                             (req:Request,res:Response,next:NextFunction)=>appointmentController.verifyPayment(req,res,next))
router.get('/user/profile',verifyTokenMiddleware,
                             authorizeRoles("user"),
                             checkStatusUser.handle.bind(checkStatusUser),
                             (req:Request,res:Response,next:NextFunction)=>userController.fetchProfile(req,res,next))
router.get('/user/sessions',verifyTokenMiddleware,
                             authorizeRoles("user"),
                             checkStatusUser.handle.bind(checkStatusUser),
                             paginationMiddleware,
                             (req:Request,res:Response,next:NextFunction)=>sessionController.listSessions(req,res,next))
router.patch('/user/sessions/:sessionId',verifyTokenMiddleware,
                             authorizeRoles("user"),
                             checkStatusUser.handle.bind(checkStatusUser),
                             paginationMiddleware,
                             (req:Request,res:Response,next:NextFunction)=>sessionController.cancelSession(req,res,next))
router.patch('/user/profile',verifyTokenMiddleware,
                             authorizeRoles("user"),
                             checkStatusUser.handle.bind(checkStatusUser),
                             upload.fields([
                                 { name: "profilePicture", maxCount: 1 },
                               ]),
                             (req:Request,res:Response,next:NextFunction)=>userController.updateProfile(req,res,next))

export default router;