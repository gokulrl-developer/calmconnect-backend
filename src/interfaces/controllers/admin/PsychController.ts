import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes";
import IPsychListUseCase from "../../../application/interfaces/IPsychListUseCase";
import IUpdatePsychStatusUseCase from "../../../application/interfaces/IUpdatePsychStatusUseCase";
import { ListPsychDTO, UpdatePsychStatusDTO } from "../../../application/dtos/admin.dto";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants";

export default class PsychController {
  constructor(
    private _listUseCase: IPsychListUseCase,
    private _updateUseCase: IUpdatePsychStatusUseCase
  ) {}

  async listPsychologists(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto: ListPsychDTO = {
        page: parseInt(req.query.page as string) || 1,
        filter: req.query?.filter as "active"|"inactive" || null,
        search: req.query?.search as string|| null,
      };
      const psychologists = await this._listUseCase.execute(dto);
      res.status(StatusCodes.OK).json({ success: true, data: psychologists });
    } catch (error) {
      next(error);
    }
  }

  async updatePsychologistStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto: UpdatePsychStatusDTO = {
        applicationId: req.params.id,
        status: req.body.status,
      };
      await this._updateUseCase.execute(dto);
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: SUCCESS_MESSAGES.STATUS_UPDATED});
    } catch (error) {
      next(error);
    }
  }
}
