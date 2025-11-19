import Review from "../../domain/entities/review.entity.js";
import Session from "../../domain/entities/session.entity.js";
import { RatingSummaryFromPersistence } from "../../domain/interfaces/IReviewRepository.js";
import { CreateReviewDTO } from "../dtos/user.dto.js";
import { PsychRatingSummary } from "../interfaces/IFetchPsychDashboardUseCase.js";

export const mapCreateReviewDTOToDomain = (
  dto: CreateReviewDTO,
  session: Session
) => {
  return new Review(
    session.id!,
    session.user,
    session.psychologist,
    dto.rating!,
    new Date(),
    undefined,
    dto.comment
  );
};

export const mapDomainToListPsychReviewsResponse = (review: Review) => {
  return {
    reviewId: review.id!,
    rating: review.rating,
    createdAt: review.createdAt.toISOString(),
    comment: review.comment,
  };
};

export const mapRatingSummaryToResponse = (
  summary: RatingSummaryFromPersistence
): PsychRatingSummary => ({
  current: summary.current,
  lastMonth: summary.lastMonth,
});