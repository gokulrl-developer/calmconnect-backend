import express, { Request, Response, NextFunction } from "express";
import GoogleAuthUserUseCase from "../../application/use-cases/user/GoogleAuthUserUseCase.js";
import LoginUserUseCase from "../../application/use-cases/user/LoginUserUseCase.js";
import RegisterUserUseCase from "../../application/use-cases/user/RegisterUserUseCase.js";
import SignUpUserUseCase from "../../application/use-cases/user/SignUpUserUseCase.js";
import UserRepository from "../../infrastructure/database/repositories/UserRepository.js";
import RedisOtpRepository from "../../infrastructure/database/repositories/RedisOtpRepository.js";
import AuthController from "../controllers/user/AuthController.js";
import UserController from "../controllers/user/UserController.js";
import verifyTokenMiddleware from "../middleware/verifyTokenMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRolesMiddleware.js";
import { CheckStatusUser } from "../middleware/checkStatus.js";
import { CheckStatusUserUseCase } from "../../application/use-cases/user/CheckStatusUserUseCase.js";
import ResendOtpSignUpUserUseCase from "../../application/use-cases/user/ResendOtpSignUpUserUseCase.js";
import ResendOtpResetUserUseCase from "../../application/use-cases/user/ResendOtpResetUserUseCase.js";
import ForgotPasswordUserUseCase from "../../application/use-cases/user/ForgotPasswordUserUseCase.js";
import ResetPasswordUserUseCase from "../../application/use-cases/user/ResetPasswordUserUseCase.js";
import PsychDetailsByUserUseCase from "../../application/use-cases/user/PsychDetailsByUserUseCase.js";
import ListPsychByUserUseCase from "../../application/use-cases/user/ListPsychByUserUseCase.js";
import PsychRepository from "../../infrastructure/database/repositories/PsychRepository.js";
import AvailabilityRuleRepository from "../../infrastructure/database/repositories/AvailabilityRuleRepository.js";
import SessionRepository from "../../infrastructure/database/repositories/SessionRepository.js";
import AppointmentController from "../controllers/user/AppointmentController.js";
import { paginationMiddleware } from "../middleware/paginationMiddleware.js";
import FetchUserProfileUseCase from "../../application/use-cases/user/FetchUserProfileUseCase.js";
import UpdateUserProfileUseCase from "../../application/use-cases/user/UpdateUserProfileUseCase.js";
import CloudinaryService from "../../infrastructure/external/CloudinaryService.js";
import FetchCheckoutDataUseCase from "../../application/use-cases/user/FetchCheckoutDataUseCase.js";
import CreateOrderUseCase from "../../application/use-cases/user/CreateOrderUseCase.js";
import RazorpayPaymentProvider from "../../infrastructure/external/RazorpayPaymentProvider.js";
import VerifyPaymentUseCase from "../../application/use-cases/user/VerifyPaymentUseCase.js";
import WalletRepository from "../../infrastructure/database/repositories/WalletRepository.js";
import TransactionRepository from "../../infrastructure/database/repositories/TransactionRepository.js";
import { upload } from "../../infrastructure/config/multerConfig.js";
import SessionController from "../controllers/user/SessionController.js";
import SessionListingUserUseCase from "../../application/use-cases/user/SessionListingUserUseCase.js";
import SpecialDayRepository from "../../infrastructure/database/repositories/SpecialDayRepository.js";
import QuickSlotRepository from "../../infrastructure/database/repositories/QuickSlotRepository.js";
import CancelSessionUserUseCase from "../../application/use-cases/user/CancelSessionUserUseCase.js";
import CheckSessionAccessUseCase from "../../application/use-cases/CheckSessionAccessUseCase.js";
import NotificationController from "../controllers/user/NotificationController.js";
import GetNotificationsUseCase from "../../application/use-cases/GetNotificationsUseCase.js";
import { NotificationRepository } from "../../infrastructure/database/repositories/NotificationRepository.js";
import BullMQNotificationQueue from "../../infrastructure/external/BullMQSessionTaskQueue.js";
import { eventBus } from "../../infrastructure/external/eventBus.js";
import MarkNotificationsReadUseCase from "../../application/use-cases/MarkNotificationReadUseCase.js";
import FinanceController from "../controllers/user/FinanceController.js";
import GenerateTransactionReceiptUseCase from "../../application/use-cases/GenerateTransactionReceiptUseCase.js";
import FetchWalletUseCase from "../../application/use-cases/FetchWalletUseCase.js";
import GetTransactionListUseCase from "../../application/use-cases/TransactionListUseCase.js";
import { PdfkitReceiptService } from "../../infrastructure/external/PdfkitReceiptService.js";
import GetUnreadNotificationCountUseCase from "../../application/use-cases/GetNotificationsCountUseCase.js";
import ComplaintController from "../controllers/user/ComplaintController.js";
import CreateComplaintUseCase from "../../application/use-cases/user/CreateComplaintUseCase.js";
import ComplaintRepository from "../../infrastructure/database/repositories/ComplaintRepository.js";
import ComplaintDetailsByUserUseCase from "../../application/use-cases/user/ComplaintDetailsByUserUseCase.js";
import ComplaintListingByUserUseCase from "../../application/use-cases/user/ComplaintListingByUserUseCase.js";
import ReviewController from "../controllers/user/ReviewController.js";
import CreateReviewUseCase from "../../application/use-cases/user/CreateReviewUseCase.js";
import ReviewRepository from "../../infrastructure/database/repositories/ReviewRepository.js";
import ListPsychReviewsUseCase from "../../application/use-cases/user/ListPsychReviewsUseCase.js";
import FetchUserDashboardUseCase from "../../application/use-cases/user/FetchUserDashboardUseCase.js";
import ClearNotificationsUseCase from "../../application/use-cases/ClearNotificationsUseCase.js";
import { USER_ROUTES } from "../constants/user-endpoints.constants.js";
import AdminRepository from "../../infrastructure/database/repositories/AdminRepository.js";


const userRepository = new UserRepository();
const otpRepository = new RedisOtpRepository();
const psychRepository = new PsychRepository();
const availabilityRuleRepository = new AvailabilityRuleRepository();
const specialDayRepository = new SpecialDayRepository();
const quickSlotRepository = new QuickSlotRepository();
const sessionRepository = new SessionRepository();
const cloudinaryService = new CloudinaryService();
const paymentProvider = new RazorpayPaymentProvider();
const walletRepository = new WalletRepository();
const transactionRepository = new TransactionRepository();
const notificationRepository = new NotificationRepository();
const notificationQueue = new BullMQNotificationQueue();
const receiptService = new PdfkitReceiptService();
const complaintRepository = new ComplaintRepository();
const reviewRepository = new ReviewRepository();
const adminRepository=new AdminRepository()

const registerUserUseCase = new RegisterUserUseCase(
  userRepository,
  otpRepository
);
const signUpUseCase = new SignUpUserUseCase(userRepository, otpRepository);
const loginUseCase = new LoginUserUseCase(userRepository);
const googleAuthUseCase = new GoogleAuthUserUseCase(userRepository);
const resendOtpSignUpUseCase = new ResendOtpSignUpUserUseCase(otpRepository);
const resendOtpResetUseCase = new ResendOtpResetUserUseCase(otpRepository);
const checkStatusUserUseCase = new CheckStatusUserUseCase(userRepository);
const forgotPasswordUserUseCase = new ForgotPasswordUserUseCase(
  otpRepository,
  userRepository
);
const resetPasswordUserUseCase = new ResetPasswordUserUseCase(
  userRepository,
  otpRepository
);
const listPsychByUserUseCase = new ListPsychByUserUseCase(
  psychRepository,
  availabilityRuleRepository,
  specialDayRepository,
  quickSlotRepository,
  sessionRepository
);
const psychDetailsByUserUseCase = new PsychDetailsByUserUseCase(
  psychRepository,
  availabilityRuleRepository,
  specialDayRepository,
  quickSlotRepository,
  sessionRepository
);
const fetchProfileUseCase = new FetchUserProfileUseCase(userRepository);
const updateProfileUseCase = new UpdateUserProfileUseCase(
  userRepository,
  cloudinaryService
);
const fetchCheckoutDataUseCase = new FetchCheckoutDataUseCase(
  psychRepository,
  availabilityRuleRepository,
  specialDayRepository,
  quickSlotRepository,
  sessionRepository
);
const createOrderUseCase = new CreateOrderUseCase(
  psychRepository,
  availabilityRuleRepository,
  specialDayRepository,
  quickSlotRepository,
  sessionRepository,
  paymentProvider
);
const verifyPaymentUseCase = new VerifyPaymentUseCase(
  paymentProvider,
  sessionRepository,
  transactionRepository,
  walletRepository,
  userRepository,
  notificationQueue,
  eventBus,
  adminRepository,
  psychRepository
);
const listSessionsByUserUseCase = new SessionListingUserUseCase(
  sessionRepository,
  psychRepository
);
const cancelSessionUseCase = new CancelSessionUserUseCase(
  sessionRepository,
  transactionRepository,
  walletRepository,
  adminRepository
);
const checkSessionAccessUseCase = new CheckSessionAccessUseCase(
  sessionRepository
);
const getNotificationUseCase = new GetNotificationsUseCase(
  notificationRepository
);
const markNotificationsReadUseCase = new MarkNotificationsReadUseCase(
  notificationRepository
);
const getUnreadNotificationCountUseCase = new GetUnreadNotificationCountUseCase(
  notificationRepository
);
const transactionListUseCase = new GetTransactionListUseCase(
  transactionRepository
);
const fetchWalletUseCase = new FetchWalletUseCase(walletRepository);
const generateTransactionReceiptUseCase = new GenerateTransactionReceiptUseCase(
  transactionRepository,
  receiptService,
  userRepository,
  psychRepository
);
const createComplaintUseCase = new CreateComplaintUseCase(
  complaintRepository,
  sessionRepository,
  userRepository,
  psychRepository,
  eventBus
);
const complaintListingByUserUseCase = new ComplaintListingByUserUseCase(
  complaintRepository,
  psychRepository,
  sessionRepository
);
const complaintDetailsByUserUseCase = new ComplaintDetailsByUserUseCase(
  complaintRepository,
  psychRepository,
  sessionRepository
);
const createReviewUseCase = new CreateReviewUseCase(
  reviewRepository,
  sessionRepository,
  psychRepository
);
const listPsychReviewsUseCase = new ListPsychReviewsUseCase(reviewRepository);
const fetchDashboardUseCase = new FetchUserDashboardUseCase(
  sessionRepository,
  transactionRepository,
  complaintRepository
);
const clearNotficationsUseCase=new ClearNotificationsUseCase(notificationRepository)

const authController = new AuthController(
  registerUserUseCase,
  signUpUseCase,
  loginUseCase,
  googleAuthUseCase,
  resendOtpSignUpUseCase,
  resendOtpResetUseCase,
  forgotPasswordUserUseCase,
  resetPasswordUserUseCase
);
const appointmentController = new AppointmentController(
  listPsychByUserUseCase,
  psychDetailsByUserUseCase,
  fetchCheckoutDataUseCase,
  createOrderUseCase,
  verifyPaymentUseCase
);
const sessionController = new SessionController(
  listSessionsByUserUseCase,
  cancelSessionUseCase,
  checkSessionAccessUseCase
);
const userController = new UserController(
  fetchProfileUseCase,
  updateProfileUseCase,
  fetchDashboardUseCase
);
const notificationController = new NotificationController(
  getNotificationUseCase,
  markNotificationsReadUseCase,
  getUnreadNotificationCountUseCase,
  clearNotficationsUseCase
);
const financeController = new FinanceController(
  transactionListUseCase,
  fetchWalletUseCase,
  generateTransactionReceiptUseCase
);
const complaintController = new ComplaintController(
  createComplaintUseCase,
  complaintListingByUserUseCase,
  complaintDetailsByUserUseCase
);
const reviewController = new ReviewController(
  createReviewUseCase,
  listPsychReviewsUseCase
);
const checkStatusUser = new CheckStatusUser(checkStatusUserUseCase);

const router = express.Router();

/* ----------------------- AUTH ROUTES ----------------------- */
router.post(
  USER_ROUTES.SIGN_UP,
  (req: Request, res: Response, next: NextFunction) =>
    authController.signUpUser(req, res, next)
);
router.post(
  USER_ROUTES.FORGOT_PASSWORD,
  (req: Request, res: Response, next: NextFunction) =>
    authController.forgotPassword(req, res, next)
);
router.post(
  USER_ROUTES.REGISTER,
  (req: Request, res: Response, next: NextFunction) =>
    authController.registerUser(req, res, next)
);
router.post(
  USER_ROUTES.RESET_PASSWORD,
  (req: Request, res: Response, next: NextFunction) =>
    authController.resetPassword(req, res, next)
);
router.post(
  USER_ROUTES.RESEND_OTP_SIGNUP,
  (req: Request, res: Response, next: NextFunction) =>
    authController.resendOtpSignUp(req, res, next)
);
router.post(
  USER_ROUTES.RESEND_OTP_RESET,
  (req: Request, res: Response, next: NextFunction) =>
    authController.resendOtpReset(req, res, next)
);
router.post(USER_ROUTES.SOCIAL_LOGIN, (req, res, next) =>
  authController.googleAuthUser(req, res, next)
);
router.post(USER_ROUTES.LOGIN, (req, res, next) =>
  authController.loginUser(req, res, next)
);

/* ----------------------- DASHBOARD ----------------------- */
router.get(
  USER_ROUTES.DASHBOARD,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  checkStatusUser.handle.bind(checkStatusUser),
  (req, res, next) => userController.getDashboard(req, res, next)
);

/* ----------------------- PSYCHOLOGISTS ----------------------- */
router.get(
  USER_ROUTES.LIST_PSYCHOLOGISTS,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  checkStatusUser.handle.bind(checkStatusUser),
  paginationMiddleware,
  (req, res, next) => appointmentController.listPsychologists(req, res, next)
);
router.get(
  USER_ROUTES.PSYCHOLOGIST_DETAILS,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  checkStatusUser.handle.bind(checkStatusUser),
  (req, res, next) => appointmentController.psychDetails(req, res, next)
);
router.get(
  USER_ROUTES.CHECKOUT_DATA,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  checkStatusUser.handle.bind(checkStatusUser),
  (req, res, next) => appointmentController.fetchCheckoutData(req, res, next)
);
router.post(
  USER_ROUTES.CREATE_ORDER,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  checkStatusUser.handle.bind(checkStatusUser),
  (req, res, next) => appointmentController.createOrder(req, res, next)
);
router.post(
  USER_ROUTES.VERIFY_PAYMENT,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  checkStatusUser.handle.bind(checkStatusUser),
  (req, res, next) => appointmentController.verifyPayment(req, res, next)
);

/* ----------------------- PROFILE ----------------------- */
router.get(
  USER_ROUTES.FETCH_PROFILE,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  checkStatusUser.handle.bind(checkStatusUser),
  (req, res, next) => userController.fetchProfile(req, res, next)
);
router.patch(
  USER_ROUTES.UPDATE_PROFILE,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  checkStatusUser.handle.bind(checkStatusUser),
  upload.fields([{ name: "profilePicture", maxCount: 1 }]),
  (req, res, next) => userController.updateProfile(req, res, next)
);

/* ----------------------- SESSIONS ----------------------- */
router.get(
  USER_ROUTES.LIST_SESSIONS,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  checkStatusUser.handle.bind(checkStatusUser),
  paginationMiddleware,
  (req, res, next) => sessionController.listSessions(req, res, next)
);
router.patch(
  USER_ROUTES.CANCEL_SESSION,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  checkStatusUser.handle.bind(checkStatusUser),
  paginationMiddleware,
  (req, res, next) => sessionController.cancelSession(req, res, next)
);
router.get(
  USER_ROUTES.SESSION_ACCESS,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  checkStatusUser.handle.bind(checkStatusUser),
  (req, res, next) =>
    sessionController.checkSessionAccess(req, res, next)
);

/* ----------------------- NOTIFICATIONS ----------------------- */
router.get(
  USER_ROUTES.LIST_NOTIFICATIONS,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  checkStatusUser.handle.bind(checkStatusUser),
  paginationMiddleware,
  notificationController.list.bind(notificationController)
);
router.patch(
  USER_ROUTES.MARK_ALL_NOTIFICATIONS_READ,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  checkStatusUser.handle.bind(checkStatusUser),
  notificationController.markAllRead.bind(notificationController)
);
router.get(
  USER_ROUTES.UNREAD_NOTIFICATIONS_COUNT,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  notificationController.getUnreadCount.bind(notificationController)
);
router.delete(
  USER_ROUTES.CLEAR_NOTIFICATIONS,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  notificationController.clearNotifications.bind(notificationController)
);

/* ----------------------- FINANCE ----------------------- */
router.get(
  USER_ROUTES.LIST_TRANSACTIONS,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  paginationMiddleware,
  financeController.listTransactions.bind(financeController)
);
router.get(
  USER_ROUTES.FETCH_WALLET,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  financeController.fetchWallet.bind(financeController)
);
router.get(
  USER_ROUTES.TRANSACTION_RECEIPT,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  financeController.generateTransactionReceipt.bind(financeController)
);

/* ----------------------- COMPLAINTS ----------------------- */
router.get(
  USER_ROUTES.FETCH_COMPLAINT_DETAILS,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  complaintController.fetchComplaintDetails.bind(complaintController)
);
router.get(
  USER_ROUTES.LIST_COMPLAINTS,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  paginationMiddleware,
  complaintController.listComplaints.bind(complaintController)
);
router.post(
  USER_ROUTES.CREATE_COMPLAINT,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  complaintController.createComplaint.bind(complaintController)
);

/* ----------------------- REVIEWS ----------------------- */
router.post(
  USER_ROUTES.CREATE_REVIEW,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  reviewController.createReview.bind(reviewController)
);
router.get(
  USER_ROUTES.LIST_REVIEWS,
  verifyTokenMiddleware,
  authorizeRoles("user"),
  paginationMiddleware,
  reviewController.listPsychReviews.bind(reviewController)
);
export default router;
