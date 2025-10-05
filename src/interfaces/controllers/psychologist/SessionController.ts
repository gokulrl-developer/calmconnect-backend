import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes";
import ISessionListingPsychUseCase from "../../../application/interfaces/ISessionListingPsychUseCase";

export default class SessionController {
  constructor(
    private readonly _listSessionsByPsychUseCase: ISessionListingPsychUseCase
  ) {}

  async listSessions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const psychId = req.account?.id;
      const result = await this._listSessionsByPsychUseCase.execute({
        psychId: psychId!,
      });

      res.status(StatusCodes.OK).json({ ...result });
    } catch (err) {
      next(err);
    }
  }
}
