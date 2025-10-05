import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes";
import ISessionListingUserUseCase from "../../../application/interfaces/ISessionListingUserUseCase";

export default class SessionController {
  constructor(
    private readonly _listSessionsByUserUseCase: ISessionListingUserUseCase
  ) {}

  async listSessions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.account?.id;
      const result = await this._listSessionsByUserUseCase.execute({
        userId: userId!,
      });

      res.status(StatusCodes.OK).json({ ...result });
    } catch (err) {
      next(err);
    }
  }
}
