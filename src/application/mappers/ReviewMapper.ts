import Review from "../../domain/entities/review.entity";
import Session from "../../domain/entities/session.entity";
import { CreateReviewDTO } from "../dtos/user.dto";

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
