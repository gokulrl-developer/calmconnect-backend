import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes";
import AppError from "../../../application/error/AppError";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants";
import { AppErrorCodes } from "../../../application/error/app-error-codes";
import { REGEX_EXP } from "../../constants/regex.constants";

import IFetchRevenueTrendsUseCase from "../../../application/interfaces/IFetchRevenueTrendsUseCase";

import {
  FetchRevenueTrendsDTO,
  FetchSessionTrendsDTO,
  FetchClientTrendsDTO,
  FetchTopPsychologistDTO,
  FetchDashboardSummaryCardsDTO,
} from "../../../application/dtos/admin.dto";
import IFetchSessionTrendsUseCase from "../../../application/interfaces/ISessionTrendsUseCase";
import IFetchClientsTrendsUseCase from "../../../application/interfaces/IFetchClientTrendsUseCase";
import IFetchTopPsychologistUseCase from "../../../application/interfaces/IFetchTopPsychologistsUseCase";
import IFetchDashboardSummaryCardsAdminUseCase from "../../../application/interfaces/IFetchDashboardSummaryCardsAdminUseCase";

export default class DashboardController {
  constructor(
    private _fetchRevenueTrendsUseCase: IFetchRevenueTrendsUseCase,
    private _fetchSessionTrendsUseCase: IFetchSessionTrendsUseCase,
    private _fetchClientsTrendsUseCase: IFetchClientsTrendsUseCase,
    private _fetchTopPsychologistUseCase: IFetchTopPsychologistUseCase,
    private _fetchDashboardSummaryCardsUseCase: IFetchDashboardSummaryCardsAdminUseCase
  ) {}

  // 🧾 Fetch Revenue Trends
  async fetchRevenueTrends(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { fromDate, toDate } = req.query;

      // --- Validation ---
      if (
        !fromDate ||
        !toDate ||
        typeof fromDate !== "string" ||
        typeof toDate !== "string" ||
        !REGEX_EXP.ISO_DATE.test(fromDate) ||
        !REGEX_EXP.ISO_DATE.test(toDate)
      ) {
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      const dto: FetchRevenueTrendsDTO = {
        fromDate,
        toDate,
      };

      const data = await this._fetchRevenueTrendsUseCase.execute(dto);
      res.status(StatusCodes.OK).json({ revenueTrends: data });
    } catch (error) {
      next(error);
    }
  }

  async fetchSessionTrends(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { fromDate, toDate } = req.query;

      if (
        !fromDate ||
        !toDate ||
        typeof fromDate !== "string" ||
        typeof toDate !== "string" ||
        !REGEX_EXP.ISO_DATE.test(fromDate) ||
        !REGEX_EXP.ISO_DATE.test(toDate)
      ) {
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      const dto: FetchSessionTrendsDTO = {
        fromDate,
        toDate,
      };

      const data = await this._fetchSessionTrendsUseCase.execute(dto);
      res.status(StatusCodes.OK).json({ sessionTrends: data });
    } catch (error) {
      next(error);
    }
  }

  async fetchRegistrationTrends(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { fromDate, toDate } = req.query;

      if (
        !fromDate ||
        !toDate ||
        typeof fromDate !== "string" ||
        typeof toDate !== "string" ||
        !REGEX_EXP.ISO_DATE.test(fromDate) ||
        !REGEX_EXP.ISO_DATE.test(toDate)
      ) {
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      const dto: FetchClientTrendsDTO = {
        fromDate,
        toDate,
      };

      const data = await this._fetchClientsTrendsUseCase.execute(dto);
      res.status(StatusCodes.OK).json({ registrationTrends: data });
    } catch (error) {
      next(error);
    }
  }

  async fetchTopPsychologists(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { fromDate, toDate, limit } = req.query;

      if (
        !fromDate ||
        !toDate ||
        typeof fromDate !== "string" ||
        typeof toDate !== "string" ||
        !REGEX_EXP.ISO_DATE.test(fromDate) ||
        !REGEX_EXP.ISO_DATE.test(toDate)
      ) {
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      if (!limit || isNaN(Number(limit)) || Number(limit) <= 0) {
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      const dto: FetchTopPsychologistDTO = {
        fromDate,
        toDate,
        limit: Number(limit),
      };

      const data = await this._fetchTopPsychologistUseCase.execute(dto);
      res.status(StatusCodes.OK).json({ topPsychologists: data });
    } catch (error) {
      next(error);
    }
  }
   async fetchSummaryCards(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { fromDate, toDate } = req.query;

      if (
        !fromDate ||
        !toDate ||
        typeof fromDate !== "string" ||
        typeof toDate !== "string" ||
        !REGEX_EXP.ISO_DATE.test(fromDate) ||
        !REGEX_EXP.ISO_DATE.test(toDate)
      ) {
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      const dto: FetchDashboardSummaryCardsDTO = { fromDate, toDate };

      const data = await this._fetchDashboardSummaryCardsUseCase.execute(dto);

      res.status(StatusCodes.OK).json({ summaryCards: data });
    } catch (error) {
      next(error);
    }
  }
}
