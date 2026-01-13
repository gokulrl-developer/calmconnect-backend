import Review from "../entities/review.entity.js";
import { PsychReviewsSortByUser } from "../enums/PsychReviewsSortByUser.js";
import IBaseRepository from "./IBaseRepository.js";

export interface ListPsychReviewsFilter {
  psychId: string;
  sort: PsychReviewsSortByUser;
  skip: number;
  limit: number;
}

export interface RatingSummaryFromPersistence {
  currentRating: number;
  lastMonthRating: number;
}

export default interface IReviewRepository extends IBaseRepository<Review> {
  listPsychReviews(
    filter: ListPsychReviewsFilter
  ): Promise<{ reviews: Review[]; totalItemCount: number }>;
  fetchRatingSummaryByPsych(
    psychId: string
  ): Promise<RatingSummaryFromPersistence>;
}
