import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes.js";
import AppError from "../../../application/error/AppError.js";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants.js";
import { AppErrorCodes } from "../../../application/error/app-error-codes.js";
import ICreateReviewUseCase from "../../../application/interfaces/ICreateReviewUseCase.js";
import IListPsychReviewsUseCase from "../../../application/interfaces/IListPsychReviewsUseCase.js";
import {
  CreateReviewDTO,
  ListPsychReviewsDTO,
} from "../../../application/dtos/user.dto.js";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants.js";
import { PsychReviewsSortByUser } from "../../../domain/enums/PsychReviewsSortByUser.js";

export default class ReviewController {
  constructor(
    private _createReviewUseCase: ICreateReviewUseCase,
    private _listPsychReviewsUseCase: IListPsychReviewsUseCase
  ) {}

  async createReview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!req.account) {
      throw new AppError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        AppErrorCodes.INTERNAL_ERROR
      );
    }
    const { sessionId, rating, comment } = req.body;
    if (!sessionId || typeof sessionId !== "string") {
      throw new AppError(
        ERROR_MESSAGES.DATA_INSUFFICIANT,
        AppErrorCodes.VALIDATION_ERROR
      );
    }

    if (!rating) {
      throw new AppError(
        ERROR_MESSAGES.REVIEW_RATING_REQUIRED,
        AppErrorCodes.VALIDATION_ERROR
      );
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      throw new AppError(
        ERROR_MESSAGES.REVIEW_RATING_INVALID_FORMAT,
        AppErrorCodes.VALIDATION_ERROR
      );
    }

    if (comment) {
      if (typeof comment !== "string") {
        throw new AppError(
          ERROR_MESSAGES.REVIEW_COMMENT_INVALID_FORMAT,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (comment.length > 300) {
        throw new AppError(
          ERROR_MESSAGES.REVIEW_COMMENT_EXCEEDS_LENGTH,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
    }

    try {
      const dto: CreateReviewDTO = {
        userId: req.account.id!,
        sessionId,
        rating,
        comment,
      };

      await this._createReviewUseCase.execute(dto);
      res
        .status(StatusCodes.CREATED)
        .json({ message: SUCCESS_MESSAGES.REVIEW_SUBMITTED });
    } catch (error) {
      next(error);
    }
  }

  async listPsychReviews(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!req.account) {
      throw new AppError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        AppErrorCodes.INTERNAL_ERROR
      );
    }
    if (!req.pagination) {
      throw new AppError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        AppErrorCodes.INTERNAL_ERROR
      );
    }
    const { psychId, sort } = req.query;

    if (!psychId || typeof psychId !== "string") {
      throw new AppError(
        ERROR_MESSAGES.DATA_INSUFFICIANT,
        AppErrorCodes.VALIDATION_ERROR
      );
    }

    if (
      sort &&
      (typeof sort !== "string" || (sort !== "recent" && sort !== "top-rated"))
    ) {
      throw new AppError(
        ERROR_MESSAGES.REVIEW_SORT_INVALID_FORMAT,
        AppErrorCodes.VALIDATION_ERROR
      );
    }

    try {
      const dto: ListPsychReviewsDTO = {
        psychId,
        sort: (sort as PsychReviewsSortByUser) || PsychReviewsSortByUser.RECENT,
        skip: req.pagination.skip!,
        limit: req.pagination.limit!,
      };

      const result = await this._listPsychReviewsUseCase.execute(dto);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
