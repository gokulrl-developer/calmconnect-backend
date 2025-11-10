import Review from "../entities/review.entity";
import IBaseRepository from "./IBaseRepository";

export interface ListPsychReviewsFilter{
    psychId:string;
    sort:"recent"|"top-rated";
    skip:number;
    limit:number;
}
export default interface IReviewRepository extends IBaseRepository<Review>{
  listPsychReviews(filter:ListPsychReviewsFilter):Promise<{reviews:Review[],totalItems:number}>
}