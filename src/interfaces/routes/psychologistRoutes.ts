import express, { Request, Response, NextFunction } from "express";
import GoogleAuthPsychUseCase from "../../application/use-cases/psychologist/GoogleAuthPsychUseCase";
import LoginPsychUseCase from "../../application/use-cases/psychologist/LoginPsychUseCase";
import RegisterPsychUseCase from "../../application/use-cases/psychologist/RegisterPsychUseCase";
import SignUpPsychUseCase from "../../application/use-cases/psychologist/SignUpPsychUseCase";
import PsychRepository from "../../infrastructure/database/repositories/PsychRepository";
import RedisOtpRepository from "../../infrastructure/database/repositories/RedisOtpRepository";
import AuthController from "../controllers/psychologist/AuthController";
import verifyTokenMiddleware from "../middleware/verifyTokenMiddleware";
import { authorizeRoles } from "../middleware/authorizeRolesMiddleware";
import PsychController from "../controllers/psychologist/PsychologistController";
import { CheckStatusPsych } from "../middleware/checkStatus";
import { CheckStatusPsychUseCase } from "../../application/use-cases/psychologist/CheckStatusPsychUseCase";
import { upload } from "../../infrastructure/config/multerConfig";
import ApplicationController from "../controllers/psychologist/ApplicationController";
import CreateApplicationUseCase from "../../application/use-cases/psychologist/CreateApplicationUseCase";
import ApplicationRepository from "../../infrastructure/database/repositories/ApplicationRepository";
import CloudinaryService from "../../infrastructure/external/CloudinaryService";
import ApplicationStatusUseCase from "../../application/use-cases/psychologist/ApplicationStatusUseCase";
import ResendOtpResetPsychUseCase from "../../application/use-cases/psychologist/ResendOtpResetPsychUseCase";
import ResendOtpSignUpPsychUseCase from "../../application/use-cases/psychologist/ResendOtpSignUpPsychUseCase";
import ForgotPasswordPsychUseCase from "../../application/use-cases/psychologist/ForgotPasswordPsychUseCase";
import ResetPasswordPsychUseCase from "../../application/use-cases/psychologist/ResetPasswordPsychUseCase";
import AvailabilityController from "../controllers/psychologist/AvailabilityController";
import AvailabilityRuleRepository from "../../infrastructure/database/repositories/AvailabilityRuleRepository";
import CreateAvailabilityRuleUseCase from "../../application/use-cases/psychologist/CreateAvailabilityRuleUseCase";
import DeleteAvailabilityRuleUseCase from "../../application/use-cases/psychologist/DeleteAvailabilityRuleUseCase";
import FetchAvailabilityRuleUseCase from "../../application/use-cases/psychologist/FetchAvailabilityRuleUseCase";
import ListAvailabilityRuleUseCase from "../../application/use-cases/psychologist/ListAvailabilityRuleUseCase";
import MarkHolidayUseCase from "../../application/use-cases/psychologist/MarkHolidayUseCase";
import HolidayRepository from "../../infrastructure/database/repositories/HolidayRepository";
import FetchDailyAvailabilityUseCase from "../../application/use-cases/psychologist/FetchDailyAvailabilityUseCase";
import DeleteHolidayUseCase from "../../application/use-cases/psychologist/DeleteHolidayUseCase";

const psychRepository = new PsychRepository();
const otpRepository = new RedisOtpRepository();
const applicationRepository = new ApplicationRepository();
const cloudinaryService = new CloudinaryService();
const availabilityRuleRepository=new AvailabilityRuleRepository(); 
const holidayRepository=new HolidayRepository();

const registerPsychUseCase = new RegisterPsychUseCase(
  psychRepository,
  otpRepository
);
const signUpUseCase = new SignUpPsychUseCase(psychRepository, otpRepository);
const loginUseCase = new LoginPsychUseCase(psychRepository);
const googleAuthUseCase = new GoogleAuthPsychUseCase(psychRepository);
const checkStatusPsychUseCase = new CheckStatusPsychUseCase(psychRepository);
const createApplicationUseCase = new CreateApplicationUseCase(
  applicationRepository,
  psychRepository,
  cloudinaryService
);
const applicationStatusUseCase = new ApplicationStatusUseCase(
  applicationRepository
);
const resendOtpSignUpUseCase=new ResendOtpSignUpPsychUseCase(otpRepository);
const resendOtpResetUseCase=new ResendOtpResetPsychUseCase(otpRepository);
const forgotPasswordUserUseCase=new ForgotPasswordPsychUseCase(otpRepository,psychRepository);
const resetPasswordUserUseCase=new ResetPasswordPsychUseCase(psychRepository,otpRepository);
const createAvailabilityRuleUseCase=new CreateAvailabilityRuleUseCase(availabilityRuleRepository)
const deleteAvailabilityRuleUseCase=new DeleteAvailabilityRuleUseCase(availabilityRuleRepository);
const fetchAvailabilityRuleUseCase=new FetchAvailabilityRuleUseCase(availabilityRuleRepository);
const listAvailabilityRuleUseCase=new ListAvailabilityRuleUseCase(availabilityRuleRepository);
const markHolidayUseCase=new MarkHolidayUseCase(holidayRepository,availabilityRuleRepository);
const fetchDailyAvailabilityUseCase=new FetchDailyAvailabilityUseCase(availabilityRuleRepository,holidayRepository);
const deleteHolidayUseCase=new DeleteHolidayUseCase(holidayRepository)

const authController = new AuthController(
  registerPsychUseCase,
  signUpUseCase,
  loginUseCase,
  googleAuthUseCase,
  resendOtpSignUpUseCase,
  resendOtpResetUseCase,
forgotPasswordUserUseCase,
resetPasswordUserUseCase
);
const psychController = new PsychController();
const applicationController = new ApplicationController(
  createApplicationUseCase,
  applicationStatusUseCase
);
const availabilityController=new AvailabilityController(
  createAvailabilityRuleUseCase,
  deleteAvailabilityRuleUseCase,
  fetchAvailabilityRuleUseCase,
  fetchDailyAvailabilityUseCase,
  listAvailabilityRuleUseCase,
  markHolidayUseCase,
  deleteHolidayUseCase
)

const checkStatusPsych = new CheckStatusPsych(checkStatusPsychUseCase);

const router = express.Router();

router.post(
  "/psychologist/sign-up",
  (req: Request, res: Response, next: NextFunction) =>
    authController.signUpPsych(req, res, next)
);
router.post(
  "/psychologist/forgot-password",
  (req: Request, res: Response, next: NextFunction) =>
    authController.forgotPasswordPsych(req, res, next)
);
router.post(
  "/psychologist/register",
  (req: Request, res: Response, next: NextFunction) =>
    authController.registerPsych(req, res, next)
);
router.post(
  "/psychologist/reset-password",
  (req: Request, res: Response, next: NextFunction) =>
    authController.resetPassword(req, res, next)
);
router.post(
  "/psychologist/resend-otp-signup",
  (req: Request, res: Response, next: NextFunction) =>
    authController.resendOtpSignUp(req, res, next)
);
router.post(
  "/psychologist/resend-otp-reset",
  (req: Request, res: Response, next: NextFunction) =>
    authController.resendOtpReset(req, res, next)
);
router.post(
  "/psychologist/social",
  (req: Request, res: Response, next: NextFunction) =>
    authController.googleAuthPsych(req, res, next)
);
router.post(
  "/psychologist/login",
  (req: Request, res: Response, next: NextFunction) =>
    authController.loginPsych(req, res, next)
);
router.get(
  "/psychologist/dashboard",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  (req: Request, res: Response, next: NextFunction) =>
    psychController.getDashboard(req, res, next)
);
router.get(
  "/psychologist/application",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  (req: Request, res: Response, next: NextFunction) =>
    applicationController.getApplication(req, res, next)
);
router.post(
  "/psychologist/apply",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  upload.fields([
    { name: "license", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  (req: Request, res: Response, next: NextFunction) =>
    applicationController.createApplication(req, res, next)
);
router.post("/psychologist/availabilityRule",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  (req:Request,res:Response,next:NextFunction) =>
    availabilityController.createAvailabilityRule(req,res,next)
)
router.delete("/psychologist/availabilityRule/:availabilityRuleId",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  (req:Request,res:Response,next:NextFunction) =>
    availabilityController.deleteAvailabilityRule(req,res,next)
)
router.get("/psychologist/availabilityRule/:availabilityRuleId",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  (req:Request,res:Response,next:NextFunction) =>
    availabilityController.fetchAvailabilityRule(req,res,next)
)
router.get("/psychologist/daily-availability",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  (req:Request,res:Response,next:NextFunction) =>
    availabilityController.fetchDailyAvailability(req,res,next)
)
router.get("/psychologist/availabilityRules",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  (req:Request,res:Response,next:NextFunction) =>
    availabilityController.listAvailabilityRule(req,res,next)
);
router.post("/psychologist/holiday",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  (req:Request,res:Response,next:NextFunction) =>
    availabilityController.markHoliday(req,res,next)
);
router.delete(`/psychologist/holiday`,
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  (req:Request,res:Response,next:NextFunction) =>
    availabilityController.deleteHoliday(req,res,next)
)
export default router;
