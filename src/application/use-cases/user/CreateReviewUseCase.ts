import ICreateReviewUseCase from "../../interfaces/ICreateReviewUseCase.js";
import { CreateReviewDTO } from "../../dtos/user.dto.js";
import IReviewRepository from "../../../domain/interfaces/IReviewRepository.js";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import { mapCreateReviewDTOToDomain } from "../../mappers/ReviewMapper.js";
import AppError from "../../error/AppError.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";

export default class CreateReviewUseCase implements ICreateReviewUseCase {
  constructor(
    private _reviewRepository: IReviewRepository,
    private _sessionRepository: ISessionRepository,
    private _psychRepository: IPsychRepository
  ) {}

  async execute(dto: CreateReviewDTO): Promise<void> {

    const session = await this._sessionRepository.findById(dto.sessionId);
    if (!session) {
      throw new AppError(
        ERROR_MESSAGES.SESSION_NOT_FOUND,
        AppErrorCodes.THERAPY_SESSION_NOT_FOUND
      );
    }


    if (session.user !== dto.userId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORISED_ACTION,
        AppErrorCodes.UNAUTHORISED_THERAPY_SESSION_ACCESS
      );
    }

    const existingReviews = await this._reviewRepository.findAll({
      sessionId: dto.sessionId,
    } as any);
    if (existingReviews.length > 0) {
      throw new AppError(
        ERROR_MESSAGES.REVIEW_ALREADY_EXISTS,
        AppErrorCodes.REVIEW_ALREADY_EXISTS
      );
    }

    const review = mapCreateReviewDTOToDomain(dto, session);
    await this._reviewRepository.create(review);

    const allReviews = await this._reviewRepository.findAll({
      psychologist: session.psychologist,
    } as any);

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await this._psychRepository.update(session.psychologist, {
      avgRating: parseFloat(avgRating.toFixed(1)),
    });
  }
}
