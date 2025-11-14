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
import ApplicationStatusUseCase from "../../application/use-cases/psychologist/FetchLatestApplicationUseCase";
import ResendOtpResetPsychUseCase from "../../application/use-cases/psychologist/ResendOtpResetPsychUseCase";
import ResendOtpSignUpPsychUseCase from "../../application/use-cases/psychologist/ResendOtpSignUpPsychUseCase";
import ForgotPasswordPsychUseCase from "../../application/use-cases/psychologist/ForgotPasswordPsychUseCase";
import ResetPasswordPsychUseCase from "../../application/use-cases/psychologist/ResetPasswordPsychUseCase";
import AvailabilityController from "../controllers/psychologist/AvailabilityController";
import AvailabilityRuleRepository from "../../infrastructure/database/repositories/AvailabilityRuleRepository";
import CreateAvailabilityRuleUseCase from "../../application/use-cases/psychologist/CreateAvailabilityRuleUseCase";
import DeleteAvailabilityRuleUseCase from "../../application/use-cases/psychologist/DeleteAvailabilityRuleUseCase";
import FetchPsychProfileUseCase from "../../application/use-cases/psychologist/FetchPsychProfileUseCase";
import UpdatePsychProfileUseCase from "../../application/use-cases/psychologist/UpdatePsychProfileUseCase";
import SessionController from "../controllers/psychologist/SessionController";
import SessionListingPsychUseCase from "../../application/use-cases/psychologist/SessionListingPsychUseCase";
import SessionRepository from "../../infrastructure/database/repositories/SessionRepository";
import UserRepository from "../../infrastructure/database/repositories/UserRepository";
import EditAvailabilityRuleUseCase from "../../application/use-cases/psychologist/EditAvailabilityRuleUseCase";
import ListAvailabilityRulesUseCase from "../../application/use-cases/psychologist/ListAvailabilityRulesUseCase";
import CreateSpecialDayUseCase from "../../application/use-cases/psychologist/CreateSpecialDayUseCase";
import EditSpecialDayUseCase from "../../application/use-cases/psychologist/EditSpecialDayUseCase";
import DeleteSpecialDayUseCase from "../../application/use-cases/psychologist/DeleteSpecialDayUseCase";
import CreateQuickSlotUseCase from "../../application/use-cases/psychologist/CreateQuickSlotUseCase";
import DeleteQuickSlotUseCase from "../../application/use-cases/psychologist/DeleteQuickSlotUseCase";
import SpecialDayRepository from "../../infrastructure/database/repositories/SpecialDayRepository";
import QuickSlotRepository from "../../infrastructure/database/repositories/QuickSlotRepository";
import EditQuickSlotUseCase from "../../application/use-cases/psychologist/EditQuickSlotUseCase";
import FetchAvailabilityRuleUseCase from "../../application/use-cases/psychologist/FetchAvailabilityRuleUseCase";
import FetchDailyAvailabilityUseCase from "../../application/use-cases/psychologist/FetchDailyAvailabilityUseCase";
import { paginationMiddleware } from "../middleware/paginationMiddleware";
import CancelSessionPsychUseCase from "../../application/use-cases/psychologist/CancelSessionPsychUseCase";
import TransactionRepository from "../../infrastructure/database/repositories/TransactionRepository";
import WalletRepository from "../../infrastructure/database/repositories/WalletRepository";
import CheckSessionAccessUseCase from "../../application/use-cases/CheckSessionAccessUseCase";
import { NotificationRepository } from "../../infrastructure/database/repositories/NotificationRepository";
import GetNotificationsUseCase from "../../application/use-cases/GetNotificationsUseCase";
import NotificationController from "../controllers/psychologist/NotificationController";
import { eventBus } from "../../infrastructure/external/eventBus";
import MarkNotificationReadUseCase from "../../application/use-cases/MarkNotificationReadUseCase";
import GetUnreadNotificationCountUseCase from "../../application/use-cases/GetNotificationsCountUseCase";
import FetchLatestApplicationUseCase from "../../application/use-cases/psychologist/FetchLatestApplicationUseCase";
import FinanceController from "../controllers/psychologist/FinanceController";
import GenerateTransactionReceiptUseCase from "../../application/use-cases/GenerateTransactionReceiptUseCase";
import FetchWalletUseCase from "../../application/use-cases/FetchWalletUseCase";
import GetTransactionListUseCase from "../../application/use-cases/TransactionListUseCase";
import { PdfkitReceiptService } from "../../infrastructure/external/PdfkitReceiptService";
import AdminConfigService from "../../infrastructure/external/AdminConfigService";
import FetchPsychDashboardUseCase from "../../application/use-cases/psychologist/FetchPsychDashboardUseCase";
import ReviewRepository from "../../infrastructure/database/repositories/ReviewRepository";
import ClearNotificationsUseCase from "../../application/use-cases/ClearNotificationsUseCase";

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
