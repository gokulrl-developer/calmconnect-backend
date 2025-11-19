import { Request, Response, NextFunction } from "express";
import express from "express";
import AuthController from "../controllers/admin/AuthController.js";
import LoginAdminUseCase from "../../application/use-cases/admin/LoginAdminUseCase.js";
import { authorizeRoles } from "../middleware/authorizeRolesMiddleware.js";
import verifyTokenMiddleware from "../middleware/verifyTokenMiddleware.js";
import ApplicationController from "../controllers/admin/ApplicationController.js";
import ApplicationListUseCase from "../../application/use-cases/admin/ApplicationListUseCase.js";
import ApplicationRepository from "../../infrastructure/database/repositories/ApplicationRepository.js";
import UpdateApplicationUseCase from "../../application/use-cases/admin/UpdateApplicationUseCase.js";
import PsychRepository from "../../infrastructure/database/repositories/PsychRepository.js";
import UserController from "../controllers/admin/UserController.js";
import PsychController from "../controllers/admin/PsychController.js";
import { UserListUseCase } from "../../application/use-cases/admin/ListUsersUseCase.js";
import { PsychListUseCase } from "../../application/use-cases/admin/ListPsychUseCase.js";
import UserRepository from "../../infrastructure/database/repositories/UserRepository.js";
import { UpdateUserStatusUseCase } from "../../application/use-cases/admin/UpdateUserStatusUseCase.js";
import { UpdatePsychUseCase } from "../../application/use-cases/admin/UpdatePsychStatusUseCase.js";
import ApplicationDetailsUseCase from "../../application/use-cases/admin/ApplicationDetailsUseCase.js";
import SessionListingAdminUseCase from "../../application/use-cases/admin/SessionListingAdminUseCase.js";
import SessionRepository from "../../infrastructure/database/repositories/SessionRepository.js";
import SessionController from "../controllers/admin/SessionController.js";
import { FetchPsychDetailsByAdminUseCase } from "../../application/use-cases/admin/FetchPsychDetailsByAdminUseCase.js";
import { FetchUserDetailsByAdminUseCase } from "../../application/use-cases/admin/FetchUserDetailsByAdminUseCase.js";
import { paginationMiddleware } from "../middleware/paginationMiddleware.js";
import GetNotificationsUseCase from "../../application/use-cases/GetNotificationsUseCase.js";
import { NotificationRepository } from "../../infrastructure/database/repositories/NotificationRepository.js";
import NotificationController from "../controllers/admin/NotificationController.js";
import MarkNotificationReadUseCase from "../../application/use-cases/MarkNotificationReadUseCase.js";
import GetUnreadNotificationCountUseCase from "../../application/use-cases/GetNotificationsCountUseCase.js";
import FinanceController from "../controllers/admin/FinanceController.js";
import GetTransactionListUseCase from "../../application/use-cases/TransactionListUseCase.js";
import TransactionRepository from "../../infrastructure/database/repositories/TransactionRepository.js";
import FetchWalletUseCase from "../../application/use-cases/FetchWalletUseCase.js";
import WalletRepository from "../../infrastructure/database/repositories/WalletRepository.js";
import GenerateTransactionReceiptUseCase from "../../application/use-cases/GenerateTransactionReceiptUseCase.js";
import { PdfkitReceiptService } from "../../infrastructure/external/PdfkitReceiptService.js";
import ComplaintController from "../controllers/admin/ComplaintController.js";
import ComplaintListingByAdminUseCase from "../../application/use-cases/admin/ComplaintListingByAdminUseCase.js";
import ComplaintRepository from "../../infrastructure/database/repositories/ComplaintRepository.js";
import ComplaintDetailsByAdminUseCase from "../../application/use-cases/admin/ComplaintDetailsByAdminUseCase.js";
import ComplaintResolutionUseCase from "../../application/use-cases/admin/ComplaintResolutionUseCase.js";
import ComplaintHistoryByPsychUseCase from "../../application/use-cases/admin/ComplaintHistoryByPsychUseCase.js";
import { eventBus } from "../../infrastructure/external/eventBus.js";
import FetchRevenueTrendsUseCase from "../../application/use-cases/admin/FetchRevenueTrendsUseCase.js";
import FetchClientsTrendsUseCase from "../../application/use-cases/admin/FetchClientTrendsUseCase.js";
import FetchSessionTrendsUseCase from "../../application/use-cases/admin/FetchSessionTrendsUseCase.js";
import FetchTopPsychologistsUseCase from "../../application/use-cases/admin/FetchTopPsychologistsUseCase.js";
import DashboardController from "../controllers/admin/DashboardController.js";
import FetchDashboardSummaryCardsUseCase from "../../application/use-cases/admin/FetchDashboardSummaryCards.js";
import ClearNotificationsUseCase from "../../application/use-cases/ClearNotificationsUseCase.js";

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
const fetchRevenueTrendsUseCase = new FetchRevenueTrendsUseCase(
  transactionRepository
);
const fetchClientsTrendsUseCase = new FetchClientsTrendsUseCase(
  userRepository,
  psychRepository
);
const fetchSessionsTrendsUseCase = new FetchSessionTrendsUseCase(
  sessionRepository
);
const fetchTopPsychologistsUseCase = new FetchTopPsychologistsUseCase(
  sessionRepository
);
const fetchDashboardSummaryCardsUseCase = new FetchDashboardSummaryCardsUseCase(
  userRepository,
  psychRepository,
  sessionRepository,
  transactionRepository
);
const clearNotficationsUseCase=new ClearNotificationsUseCase(notificationRepository)

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
  getUnreadNotificationCountUseCase,
  clearNotficationsUseCase
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
const dashboardController = new DashboardController(
  fetchRevenueTrendsUseCase,
  fetchSessionsTrendsUseCase,
  fetchClientsTrendsUseCase,
  fetchTopPsychologistsUseCase,
  fetchDashboardSummaryCardsUseCase 
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
router.delete(
  "/admin/notifications",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  notificationController.clearNotifications.bind(notificationController)
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

/* ---------------- Dashboard ---------------- */
router.get(
  "/admin/dashboard/revenue",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  (req, res, next) => dashboardController.fetchRevenueTrends(req, res, next)
);

router.get(
  "/admin/dashboard/clients",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  (req, res, next) =>
    dashboardController.fetchRegistrationTrends(req, res, next)
);

router.get(
  "/admin/dashboard/sessions",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  (req, res, next) => dashboardController.fetchSessionTrends(req, res, next)
);

router.get(
  "/admin/dashboard/top-psychologists",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  (req, res, next) => dashboardController.fetchTopPsychologists(req, res, next)
);
router.get(
  "/admin/dashboard/summary-cards",
  verifyTokenMiddleware,
  authorizeRoles("admin"),
  (req, res, next) => dashboardController.fetchSummaryCards(req, res, next)
);
export default router;
