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

const applicationRepository=new ApplicationRepository()
const psychRepository=new PsychRepository()
const userRepository=new UserRepository();
const sessionRepository=new SessionRepository();

const loginAdminUseCase=new LoginAdminUseCase()
const listUseCase=new ApplicationListUseCase(applicationRepository)
const updateApplicationUseCase=new UpdateApplicationUseCase(applicationRepository,psychRepository)
const listUserUseCase=new UserListUseCase(userRepository)
const listPsychUseCase=new PsychListUseCase(psychRepository)
const updateUserUseCase=new UpdateUserStatusUseCase(userRepository);
const updatePsychUseCase=new UpdatePsychUseCase(psychRepository);
const applicationDetailsUseCase=new ApplicationDetailsUseCase(applicationRepository)
const listSessionsUseCase=new SessionListingAdminUseCase(sessionRepository,userRepository,psychRepository)
const fetchPsychDetailsUseCase=new FetchPsychDetailsByAdminUseCase(psychRepository);
const fetchUserDetailsUseCase=new FetchUserDetailsByAdminUseCase(userRepository)

const authController=new AuthController(loginAdminUseCase);
const applicationController=new ApplicationController(listUseCase,updateApplicationUseCase,applicationDetailsUseCase)
const userController=new UserController(listUserUseCase,updateUserUseCase,fetchUserDetailsUseCase);
const psychController=new PsychController(listPsychUseCase,updatePsychUseCase,fetchPsychDetailsUseCase);
//const sessionController=new SessionController(listSessionsUseCase);

const router =express.Router();



router.post("/admin/login",(req,res,next)=>authController.loginAdmin(req,res,next));
router.get("/admin/applications",verifyTokenMiddleware,
                             authorizeRoles("admin"),
                             (req:Request,res:Response,next:NextFunction)=>applicationController.listApplications(req,res,next))
router.patch("/admin/application/:id",verifyTokenMiddleware,
                             authorizeRoles("admin"),
                             (req:Request,res:Response,next:NextFunction)=>applicationController.updateApplicationStatus(req,res,next))
router.get("/admin/application/:id",verifyTokenMiddleware,
                             authorizeRoles("admin"),
                             (req:Request,res:Response,next:NextFunction)=>applicationController.findApplicationDetails(req,res,next))
router.get("/admin/users",verifyTokenMiddleware,
                             authorizeRoles("admin"),
                             (req:Request,res:Response,next:NextFunction)=>userController.listUsers(req,res,next))
router.patch("/admin/user/:id",verifyTokenMiddleware,
                             authorizeRoles("admin"),
                             (req:Request,res:Response,next:NextFunction)=>userController.updateUserStatus(req,res,next))
router.get("/admin/psychologists",verifyTokenMiddleware,
                             authorizeRoles("admin"),
                             (req:Request,res:Response,next:NextFunction)=>psychController.listPsychologists(req,res,next))
router.patch("/admin/psychologist/:id",verifyTokenMiddleware,
                             authorizeRoles("admin"),
                             (req:Request,res:Response,next:NextFunction)=>psychController.updatePsychologistStatus(req,res,next))
router.get("/admin/psychologist-details/:psychId",verifyTokenMiddleware,
                             authorizeRoles("admin"),
                             (req:Request,res:Response,next:NextFunction)=>psychController.fetchPsychDetails(req,res,next));
router.get("/admin/user-details/:userId",verifyTokenMiddleware,
                             authorizeRoles("admin"),
                             (req:Request,res:Response,next:NextFunction)=>userController.fetchUserDetails(req,res,next))
// router.get("/admin/sessions",verifyTokenMiddleware,
//                              authorizeRoles("admin"),
//                              (req:Request,res:Response,next:NextFunction)=>sessionController.listSessions(req,res,next))
export default router;