import { ListPsychReviewsDTO } from "../dtos/user.dto.js";
import PaginationData from "../utils/calculatePagination.js";

export interface ListPsychReviewsItem {
  reviewId: string;
  rating: number; // 1-5
  createdAt: string;
  comment?: string; // 300 characters ...
}
export interface ListPsychReviewsResponse {
  paginationData: PaginationData;
  reviews: ListPsychReviewsItem[];
}
export default interface IListPsychReviewsUseCase {
  execute(dto: ListPsychReviewsDTO): Promise<ListPsychReviewsResponse>;
}
