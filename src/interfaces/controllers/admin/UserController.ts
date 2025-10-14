import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes";
import IUserListUseCase from "../../../application/interfaces/IUserListUseCase";
import IUpdateUserStatusUseCase from "../../../application/interfaces/IUpdateUserStatusUseCase";
import { ListUsersDTO, UpdateUserStatusDTO } from "../../../application/dtos/admin.dto";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants";
import IFetchUserDetailsByAdminUseCase, { AdminUserDetails } from "../../../application/interfaces/IFetchUserDetailsByAdminUseCase";

export default class UserController {
  constructor(
    private _listUseCase: IUserListUseCase,
    private _updateUseCase: IUpdateUserStatusUseCase,
    private _fetchDetailsUseCase:IFetchUserDetailsByAdminUseCase
  ) {}

  async listUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto: ListUsersDTO = {
        page: parseInt(req.query.page as string) || 1,
        filter: req.query?.filter as "active"|"inactive" || null,
        search: req.query?.search as string || null
      };
      const users = await this._listUseCase.execute(dto);
      res.status(StatusCodes.OK).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto: UpdateUserStatusDTO = {
        applicationId: req.params.id,
        status: req.body.status,
      };
      await this._updateUseCase.execute(dto);
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: SUCCESS_MESSAGES.STATUS_UPDATED });
    } catch (error) {
      next(error);
    }
  }

   async fetchUserDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const userDetails: AdminUserDetails =
        await this._fetchDetailsUseCase.execute({ userId });
      res.status(StatusCodes.OK).json({ success: true, data: userDetails });
    } catch (error) {
      next(error);
    }
  }
}
