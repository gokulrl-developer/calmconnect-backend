import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes";
import ISessionListingAdminUseCase from "../../../application/interfaces/ISessionListingAdminUseCase";

export default class SessionController {
  constructor(
    private readonly _listSessionsUseCase: ISessionListingAdminUseCase
  ) {}

  async listSessions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this._listSessionsUseCase.execute({
        status:req.query.status as "scheduled" | "completed" | "cancelled" | "available" | "pending",
        skip: req.pagination?.skip!,
        limit: req.pagination?.limit!,
      });

      res.status(StatusCodes.OK).json({ ...result });
    } catch (err) {
      next(err);
    }
  }
}
