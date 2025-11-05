import { Request, Response, NextFunction } from "express";
import express from "express";
import AuthController from "../controllers/admin/AuthController";
import LoginAdminUseCase from "../../application/use-cases/admin/LoginAdminUseCase";
import { authorizeRoles } from "../middleware/authorizeRolesMiddleware";
import verifyTokenMiddleware from "../middleware/verifyTokenMiddleware";
import ApplicationController from "../controllers/admin/ApplicationController";
import ApplicationListUseCase from "../../application/use-cases/admin/ApplicationListUseCase";
import ApplicationRepository from "../../infrastructure/database/repositories/ApplicationRepository";
import UpdateApplicationUseCase from "../../application/use-cases/admin/UpdateApplicationUseCase";
import PsychRepository from "../../infrastructure/database/repositories/PsychRepository";
import UserController from "../controllers/admin/UserController";
import PsychController from "../controllers/admin/PsychController";
import { UserListUseCase } from "../../application/use-cases/admin/ListUsersUseCase";
import { PsychListUseCase } from "../../application/use-cases/admin/ListPsychUseCase";
import UserRepository from "../../infrastructure/database/repositories/UserRepository";
import { UpdateUserStatusUseCase } from "../../application/use-cases/admin/UpdateUserStatusUseCase";
import { UpdatePsychUseCase } from "../../application/use-cases/admin/UpdatePsychStatusUseCase";
import ApplicationDetailsUseCase from "../../application/use-cases/admin/ApplicationDetailsUseCase";
import SessionListingAdminUseCase from "../../application/use-cases/admin/SessionListingAdminUseCase";
import SessionRepository from "../../infrastructure/database/repositories/SessionRepository";
import SessionController from "../controllers/admin/SessionController";
import { FetchPsychDetailsByAdminUseCase } from "../../application/use-cases/admin/FetchPsychDetailsByAdminUseCase";
import { FetchUserDetailsByAdminUseCase } from "../../application/use-cases/admin/FetchUserDetailsByAdminUseCase";
import { paginationMiddleware } from "../middleware/paginationMiddleware";
import GetNotificationsUseCase from "../../application/use-cases/GetNotificationsUseCase";
import { NotificationRepository } from "../../infrastructure/database/repositories/NotificationRepository";
import NotificationController from "../controllers/admin/NotificationController";
import MarkNotificationReadUseCase from "../../application/use-cases/MarkNotificationReadUseCase";
import GetUnreadNotificationCountUseCase from "../../application/use-cases/GetNotificationsCountUseCase";
import FinanceController from "../controllers/admin/FinanceController";
import GetTransactionListUseCase from "../../application/use-cases/TransactionListUseCase";
import TransactionRepository from "../../infrastructure/database/repositories/TransactionRepository";
import FetchWalletUseCase from "../../application/use-cases/FetchWalletUseCase";
import WalletRepository from "../../infrastructure/database/repositories/WalletRepository";
import GenerateTransactionReceiptUseCase from "../../application/use-cases/GenerateTransactionReceiptUseCase";
import { PdfkitReceiptService } from "../../infrastructure/external/PdfkitReceiptService";
import ComplaintController from "../controllers/admin/ComplaintController";
import ComplaintListingByAdminUseCase from "../../application/use-cases/admin/ComplaintListingByAdminUseCase";
import ComplaintRepository from "../../infrastructure/database/repositories/ComplaintRepository";
import ComplaintDetailsByAdminUseCase from "../../application/use-cases/admin/ComplaintDetailsByAdminUseCase";
import ComplaintResolutionUseCase from "../../application/use-cases/admin/ComplaintResolutionUseCase";
import ComplaintHistoryByPsychUseCase from "../../application/use-cases/admin/ComplaintHistoryByPsychUseCase";
import { eventBus } from "../../infrastructure/external/eventBus";

const applicationRepository = new ApplicationRepository();
const psychRepository = new PsychRepository();
const userRepository = new UserRepository();
const sessionRepository = new SessionRepository();
const notificationRepository = new NotificationRepository();
const transactionRepository = new TransactionRepository();
const walletRepository = new WalletRepository();
const receiptService = new PdfkitReceiptService();
const complaintRepository = new ComplaintRepository();

const loginAdminUseCase = new LoginAdminUseCase();
const listUseCase = new ApplicationListUseCase(applicationRepository);
const updateApplicationUseCase = new UpdateApplicationUseCase(
  applicationRepository,
  psychRepository
);
const listUserUseCase = new UserListUseCase(userRepository);
const listPsychUseCase = new PsychListUseCase(psychRepository);
const updateUserUseCase = new UpdateUserStatusUseCase(userRepository);
const updatePsychUseCase = new UpdatePsychUseCase(psychRepository);
const applicationDetailsUseCase = new ApplicationDetailsUseCase(
  applicationRepository
);
const listSessionsUseCase = new SessionListingAdminUseCase(
  sessionRepository,
  userRepository,
  psychRepository
);
const fetchPsychDetailsUseCase = new FetchPsychDetailsByAdminUseCase(
  psychRepository
);
const fetchUserDetailsUseCase = new FetchUserDetailsByAdminUseCase(
  userRepository
);
const getNotificationUseCase = new GetNotificationsUseCase(
  notificationRepository
);
const markNotificationReadUseCase = new MarkNotificationReadUseCase(
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
const complaintListingByAdminUseCase = new ComplaintListingByAdminUseCase(
  complaintRepository,
  userRepository,
  psychRepository,
  sessionRepository
);
const complaintDetailsByAdminUseCase = new ComplaintDetailsByAdminUseCase(
  complaintRepository,
  userRepository,
  psychRepository,
  sessionRepository
);
const complaintResolutionUseCase = new ComplaintResolutionUseCase(
  complaintRepository,
  psychRepository,
  eventBus
);
const complaintHistoryByPsychUseCase = new ComplaintHistoryByPsychUseCase(
  complaintRepository,
  userRepository,
  psychRepository,
  sessionRepository
);

const authController = new AuthController(loginAdminUseCase);
const applicationController = new ApplicationController(
  listUseCase,
  updateApplicationUseCase,
  applicationDetailsUseCase
);
const userController = new UserController(
  listUserUseCase,
  updateUserUseCase,
  fetchUserDetailsUseCase
);
const psychController = new PsychController(
  listPsychUseCase,
  updatePsychUseCase,
  fetchPsychDetailsUseCase
);
const sessionController = new SessionController(listSessionsUseCase);
const notificationController = new NotificationController(
  getNotificationUseCase,
  markNotificationReadUseCase,
  getUnreadNotificationCountUseCase
);
const financeController = new FinanceController(
  transactionListUseCase,
  fetchWalletUseCase,
  generateTransactionReceiptUseCase
);
const complaintController = new ComplaintController(
  complaintDetailsByAdminUseCase,
  complaintListingByAdminUseCase,
  complaintResolutionUseCase,
  complaintHistoryByPsychUseCase
);
const router = express.Router();

router.post("/admin/login", (req, res, next) =>
  authController.loginAdmin(req, res, next)
);
router.get(
  "/admin/applications",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  (req: Request, res: Response, next: NextFunction) =>
    applicationController.listApplications(req, res, next)
);
router.patch(
  "/admin/application/:id",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  (req: Request, res: Response, next: NextFunction) =>
    applicationController.updateApplicationStatus(req, res, next)
);
router.get(
  "/admin/application/:id",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  (req: Request, res: Response, next: NextFunction) =>
    applicationController.findApplicationDetails(req, res, next)
);
router.get(
  "/admin/users",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  (req: Request, res: Response, next: NextFunction) =>
    userController.listUsers(req, res, next)
);
router.patch(
  "/admin/user/:id",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  (req: Request, res: Response, next: NextFunction) =>
    userController.updateUserStatus(req, res, next)
);
router.get(
  "/admin/psychologists",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  (req: Request, res: Response, next: NextFunction) =>
    psychController.listPsychologists(req, res, next)
);
router.patch(
  "/admin/psychologist/:id",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  (req: Request, res: Response, next: NextFunction) =>
    psychController.updatePsychologistStatus(req, res, next)
);
router.get(
  "/admin/psychologist-details/:psychId",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  (req: Request, res: Response, next: NextFunction) =>
    psychController.fetchPsychDetails(req, res, next)
);
router.get(
  "/admin/user-details/:userId",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  (req: Request, res: Response, next: NextFunction) =>
    userController.fetchUserDetails(req, res, next)
);
router.get(
  "/admin/sessions",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  paginationMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    sessionController.listSessions(req, res, next)
);

/* ----------------notifications ------------------------------------------- */

router.get(
  "/admin/notifications",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  paginationMiddleware,
  notificationController.list.bind(notificationController)
);
router.patch(
  "/admin/notifications",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  notificationController.markRead.bind(notificationController)
);
router.get(
  "/admin/notifications/count",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  notificationController.getUnreadCount.bind(notificationController)
);
router.get(
  "/admin/transactions",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  paginationMiddleware,
  financeController.listTransactions.bind(financeController)
);
router.get(
  "/admin/wallet",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  financeController.fetchWallet.bind(financeController)
);
router.get(
  "/admin/transactions/:transactionId/receipt",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  financeController.generateTransactionReceipt.bind(financeController)
);

/* complaint related routes */
router.get(
  "/admin/complaints/:complaintId/",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  complaintController.fetchComplaintDetails.bind(complaintController)
);
router.get(
  "/admin/complaints/",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  paginationMiddleware,
  complaintController.listComplaints.bind(complaintController)
);
router.get(
  "/admin/complaints/",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  paginationMiddleware,
  complaintController.listComplaintHistory.bind(complaintController)
);
router.patch(
  "/admin/complaints/:complaintId",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  complaintController.resolveComplaint.bind(complaintController)
);

export default router;
