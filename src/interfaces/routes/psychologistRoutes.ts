import express, { Request, Response, NextFunction } from "express";
import GoogleAuthPsychUseCase from "../../application/use-cases/psychologist/GoogleAuthPsychUseCase.js";
import LoginPsychUseCase from "../../application/use-cases/psychologist/LoginPsychUseCase.js";
import RegisterPsychUseCase from "../../application/use-cases/psychologist/RegisterPsychUseCase.js";
import SignUpPsychUseCase from "../../application/use-cases/psychologist/SignUpPsychUseCase.js";
import PsychRepository from "../../infrastructure/database/repositories/PsychRepository.js";
import RedisOtpRepository from "../../infrastructure/database/repositories/RedisOtpRepository.js";
import AuthController from "../controllers/psychologist/AuthController.js";
import verifyTokenMiddleware from "../middleware/verifyTokenMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRolesMiddleware.js";
import PsychController from "../controllers/psychologist/PsychologistController.js";
import { CheckStatusPsych } from "../middleware/checkStatus.js";
import { CheckStatusPsychUseCase } from "../../application/use-cases/psychologist/CheckStatusPsychUseCase.js";
import { upload } from "../../infrastructure/config/multerConfig.js";
import ApplicationController from "../controllers/psychologist/ApplicationController.js";
import CreateApplicationUseCase from "../../application/use-cases/psychologist/CreateApplicationUseCase.js";
import ApplicationRepository from "../../infrastructure/database/repositories/ApplicationRepository.js";
import CloudinaryService from "../../infrastructure/external/CloudinaryService.js";
import ApplicationStatusUseCase from "../../application/use-cases/psychologist/FetchLatestApplicationUseCase.js";
import ResendOtpResetPsychUseCase from "../../application/use-cases/psychologist/ResendOtpResetPsychUseCase.js";
import ResendOtpSignUpPsychUseCase from "../../application/use-cases/psychologist/ResendOtpSignUpPsychUseCase.js";
import ForgotPasswordPsychUseCase from "../../application/use-cases/psychologist/ForgotPasswordPsychUseCase.js";
import ResetPasswordPsychUseCase from "../../application/use-cases/psychologist/ResetPasswordPsychUseCase.js";
import AvailabilityController from "../controllers/psychologist/AvailabilityController.js";
import AvailabilityRuleRepository from "../../infrastructure/database/repositories/AvailabilityRuleRepository.js";
import CreateAvailabilityRuleUseCase from "../../application/use-cases/psychologist/CreateAvailabilityRuleUseCase.js";
import DeleteAvailabilityRuleUseCase from "../../application/use-cases/psychologist/DeleteAvailabilityRuleUseCase.js";
import FetchPsychProfileUseCase from "../../application/use-cases/psychologist/FetchPsychProfileUseCase.js";
import UpdatePsychProfileUseCase from "../../application/use-cases/psychologist/UpdatePsychProfileUseCase.js";
import SessionController from "../controllers/psychologist/SessionController.js";
import SessionListingPsychUseCase from "../../application/use-cases/psychologist/SessionListingPsychUseCase.js";
import SessionRepository from "../../infrastructure/database/repositories/SessionRepository.js";
import UserRepository from "../../infrastructure/database/repositories/UserRepository.js";
import EditAvailabilityRuleUseCase from "../../application/use-cases/psychologist/EditAvailabilityRuleUseCase.js";
import ListAvailabilityRulesUseCase from "../../application/use-cases/psychologist/ListAvailabilityRulesUseCase.js";
import CreateSpecialDayUseCase from "../../application/use-cases/psychologist/CreateSpecialDayUseCase.js";
import EditSpecialDayUseCase from "../../application/use-cases/psychologist/EditSpecialDayUseCase.js";
import DeleteSpecialDayUseCase from "../../application/use-cases/psychologist/DeleteSpecialDayUseCase.js";
import CreateQuickSlotUseCase from "../../application/use-cases/psychologist/CreateQuickSlotUseCase.js";
import DeleteQuickSlotUseCase from "../../application/use-cases/psychologist/DeleteQuickSlotUseCase.js";
import SpecialDayRepository from "../../infrastructure/database/repositories/SpecialDayRepository.js";
import QuickSlotRepository from "../../infrastructure/database/repositories/QuickSlotRepository.js";
import EditQuickSlotUseCase from "../../application/use-cases/psychologist/EditQuickSlotUseCase.js";
import FetchAvailabilityRuleUseCase from "../../application/use-cases/psychologist/FetchAvailabilityRuleUseCase.js";
import FetchDailyAvailabilityUseCase from "../../application/use-cases/psychologist/FetchDailyAvailabilityUseCase.js";
import { paginationMiddleware } from "../middleware/paginationMiddleware.js";
import CancelSessionPsychUseCase from "../../application/use-cases/psychologist/CancelSessionPsychUseCase.js";
import TransactionRepository from "../../infrastructure/database/repositories/TransactionRepository.js";
import WalletRepository from "../../infrastructure/database/repositories/WalletRepository.js";
import CheckSessionAccessUseCase from "../../application/use-cases/CheckSessionAccessUseCase.js";
import { NotificationRepository } from "../../infrastructure/database/repositories/NotificationRepository.js";
import GetNotificationsUseCase from "../../application/use-cases/GetNotificationsUseCase.js";
import NotificationController from "../controllers/psychologist/NotificationController.js";
import { eventBus } from "../../infrastructure/external/eventBus.js";
import MarkNotificationReadUseCase from "../../application/use-cases/MarkNotificationReadUseCase.js";
import GetUnreadNotificationCountUseCase from "../../application/use-cases/GetNotificationsCountUseCase.js";
import FetchLatestApplicationUseCase from "../../application/use-cases/psychologist/FetchLatestApplicationUseCase.js";
import FinanceController from "../controllers/psychologist/FinanceController.js";
import GenerateTransactionReceiptUseCase from "../../application/use-cases/GenerateTransactionReceiptUseCase.js";
import FetchWalletUseCase from "../../application/use-cases/FetchWalletUseCase.js";
import GetTransactionListUseCase from "../../application/use-cases/TransactionListUseCase.js";
import { PdfkitReceiptService } from "../../infrastructure/external/PdfkitReceiptService.js";
import AdminConfigService from "../../infrastructure/external/AdminConfigService.js";
import FetchPsychDashboardUseCase from "../../application/use-cases/psychologist/FetchPsychDashboardUseCase.js";
import ReviewRepository from "../../infrastructure/database/repositories/ReviewRepository.js";
import ClearNotificationsUseCase from "../../application/use-cases/ClearNotificationsUseCase.js";


const psychRepository = new PsychRepository();
const otpRepository = new RedisOtpRepository();
const applicationRepository = new ApplicationRepository();
const cloudinaryService = new CloudinaryService();
const availabilityRuleRepository = new AvailabilityRuleRepository();
const specialDayRepository = new SpecialDayRepository();
const quickSlotRepository = new QuickSlotRepository();
const sessionRepository = new SessionRepository();
const userRepository = new UserRepository();
const transactionRepository = new TransactionRepository();
const walletRepository = new WalletRepository();
const notificationRepository = new NotificationRepository();
const receiptService=new PdfkitReceiptService();
const adminConfigService=new AdminConfigService();
const reviewRepository=new ReviewRepository();

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
  cloudinaryService,
  eventBus
);
const applicationStatusUseCase = new ApplicationStatusUseCase(
  applicationRepository
);
const resendOtpSignUpUseCase = new ResendOtpSignUpPsychUseCase(otpRepository);
const resendOtpResetUseCase = new ResendOtpResetPsychUseCase(otpRepository);
const forgotPasswordUserUseCase = new ForgotPasswordPsychUseCase(
  otpRepository,
  psychRepository
);
const resetPasswordUserUseCase = new ResetPasswordPsychUseCase(
  psychRepository,
  otpRepository
);
const fetchPsychProfileUseCase = new FetchPsychProfileUseCase(psychRepository);
const updatePsychProfileUseCase = new UpdatePsychProfileUseCase(
  psychRepository,
  cloudinaryService
);
const listSessionByPsychUseCase = new SessionListingPsychUseCase(
  sessionRepository,
  userRepository
);
const createAvailabilityRuleUseCase = new CreateAvailabilityRuleUseCase(
  availabilityRuleRepository
);
const editAvailabilityRuleUseCase = new EditAvailabilityRuleUseCase(
  availabilityRuleRepository,
  quickSlotRepository
);
const deleteAvailabilityRuleUseCase = new DeleteAvailabilityRuleUseCase(
  availabilityRuleRepository
);
const fetchAvailabilityRuleUseCase = new FetchAvailabilityRuleUseCase(
  availabilityRuleRepository
);
const listAvailabilityRuleUseCase = new ListAvailabilityRulesUseCase(
  availabilityRuleRepository
);
const createSpecialDayUseCase = new CreateSpecialDayUseCase(
  specialDayRepository,
  quickSlotRepository
);
const editSpecialDayUseCase = new EditSpecialDayUseCase(
  specialDayRepository,
  quickSlotRepository
);
const deleteSpecialDayUseCase = new DeleteSpecialDayUseCase(
  specialDayRepository,
  psychRepository
);
const createQuickSlotUseCase = new CreateQuickSlotUseCase(
  quickSlotRepository,
  specialDayRepository,
  availabilityRuleRepository
);
const editQuickSlotUseCase = new EditQuickSlotUseCase(
  quickSlotRepository,
  specialDayRepository,
  availabilityRuleRepository
);
const deleteQuickSlotUseCase = new DeleteQuickSlotUseCase(
  quickSlotRepository,
);
const fetchDailyAvailabilityUseCase = new FetchDailyAvailabilityUseCase(
  availabilityRuleRepository,
  specialDayRepository,
  quickSlotRepository
);
const cancelSessionUseCase = new CancelSessionPsychUseCase(
  sessionRepository,
  transactionRepository,
  walletRepository,
  adminConfigService
);
const fetchLatestApplicationUseCase = new FetchLatestApplicationUseCase(
  applicationRepository
);
const checkSessionAccessUseCase = new CheckSessionAccessUseCase(
  sessionRepository
);
const getNotificationUseCase = new GetNotificationsUseCase(
  notificationRepository
);
const markNotificationsReadUseCase = new MarkNotificationReadUseCase(
  notificationRepository
);
const getUnreadNotificationCountUseCase = new GetUnreadNotificationCountUseCase(
  notificationRepository
);
const transactionListUseCase=new GetTransactionListUseCase(transactionRepository)
const fetchWalletUseCase=new FetchWalletUseCase(walletRepository)
const generateTransactionReceiptUseCase=new GenerateTransactionReceiptUseCase(transactionRepository,receiptService,userRepository,psychRepository)
const fetchPsychDashboardUseCase = new FetchPsychDashboardUseCase(
  sessionRepository,
  transactionRepository,
  reviewRepository
);
const clearNotficationsUseCase=new ClearNotificationsUseCase(notificationRepository)

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
const psychController = new PsychController(
  fetchPsychProfileUseCase,
  updatePsychProfileUseCase,
  fetchPsychDashboardUseCase
);
const applicationController = new ApplicationController(
  createApplicationUseCase,
  fetchLatestApplicationUseCase
);
const availabilityController = new AvailabilityController(
  createAvailabilityRuleUseCase,
  editAvailabilityRuleUseCase,
  deleteAvailabilityRuleUseCase,
  createSpecialDayUseCase,
  editSpecialDayUseCase,
  deleteSpecialDayUseCase,
  createQuickSlotUseCase,
  editQuickSlotUseCase,
  deleteQuickSlotUseCase,
  fetchAvailabilityRuleUseCase,
  fetchDailyAvailabilityUseCase,
  listAvailabilityRuleUseCase
);

const sessionController = new SessionController(
  listSessionByPsychUseCase,
  cancelSessionUseCase,
  checkSessionAccessUseCase
);
const notificationController = new NotificationController(
  getNotificationUseCase,
  markNotificationsReadUseCase,
  getUnreadNotificationCountUseCase,
  clearNotficationsUseCase
);
const financeController=new FinanceController(transactionListUseCase,fetchWalletUseCase,generateTransactionReceiptUseCase)

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

router.get(
  `/psychologist/profile`,
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  (req: Request, res: Response, next: NextFunction) =>
    psychController.fetchProfile(req, res, next)
);
router.get(
  `/psychologist/sessions`,
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  paginationMiddleware,
  checkStatusPsych.handle.bind(checkStatusPsych),
  (req: Request, res: Response, next: NextFunction) =>
    sessionController.listSessions(req, res, next)
);
router.patch(
  `/psychologist/profile`,
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  upload.fields([{ name: "profilePicture", maxCount: 1 }]),
  (req: Request, res: Response, next: NextFunction) =>
    psychController.updateProfile(req, res, next)
);

// ------------------ Availability Routes ------------------

router.post(
  "/psychologist/availability-rule",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  availabilityController.createAvailabilityRule.bind(availabilityController)
);

router.patch(
  "/psychologist/availability-rule/:availabilityRuleId",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  availabilityController.editAvailabilityRule.bind(availabilityController)
);

router.delete(
  "/psychologist/availability-rule/:availabilityRuleId",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  availabilityController.deleteAvailabilityRule.bind(availabilityController)
);

router.get(
  "/psychologist/availability-rule",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  availabilityController.fetchAvailabilityRule.bind(availabilityController)
);

router.get(
  "/psychologist/availability-rules",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  availabilityController.listAvailabilityRules.bind(availabilityController)
);

// ---------- Special Day ----------
router.post(
  "/psychologist/special-day",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  availabilityController.createSpecialDay.bind(availabilityController)
);

router.patch(
  "/psychologist/special-day/:specialDayId",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  availabilityController.editSpecialDay.bind(availabilityController)
);

router.delete(
  "/psychologist/special-day/:specialDayId",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  availabilityController.deleteSpecialDay.bind(availabilityController)
);

router.post(
  "/psychologist/quick-slot",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  availabilityController.createQuickSlot.bind(availabilityController)
);

router.patch(
  "/psychologist/quick-slot/:quickSlotId",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  availabilityController.editQuickSlot.bind(availabilityController)
);

router.delete(
  "/psychologist/quick-slot/:quickSlotId",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  availabilityController.deleteQuickSlot.bind(availabilityController)
);

router.get(
  "/psychologist/daily-availability",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  availabilityController.fetchDailyAvailability.bind(availabilityController)
);
router.get(
  "/psychologist/application",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  applicationController.getApplication.bind(applicationController)
);

router.patch(
  "/psychologist/sessions/:sessionId",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  sessionController.cancelSession.bind(sessionController)
);
router.get(
  "/psychologist/sessions/:sessionId/access",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  sessionController.checkSessionAccess.bind(sessionController)
);

/* ----------------notifications ------------------------------------------- */

router.get(
  "/psychologist/notifications",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  paginationMiddleware,
  checkStatusPsych.handle.bind(checkStatusPsych),
  notificationController.list.bind(notificationController)
);
router.patch(
  "/psychologist/notifications",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  checkStatusPsych.handle.bind(checkStatusPsych),
  notificationController.markAllRead.bind(notificationController)
);
router.get(
  "/psychologist/notifications/count",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  notificationController.getUnreadCount.bind(notificationController)
);
router.delete(
  "/psychologist/notifications",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  notificationController.clearNotifications.bind(notificationController)
);


router.get(
  "/psychologist/transactions",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  paginationMiddleware,
  financeController.listTransactions.bind(financeController)
);
router.get(
  "/psychologist/wallet",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  financeController.fetchWallet.bind(financeController)
);
router.get(
  "/psychologist/transactions/:transactionId/receipt",
  verifyTokenMiddleware,
  authorizeRoles("psychologist"),
  financeController.generateTransactionReceipt.bind(financeController)
);

export default router;
