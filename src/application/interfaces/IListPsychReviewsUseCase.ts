import { ListPsychReviewsDTO } from "../dtos/user.dto";
import PaginationData from "../utils/calculatePagination";

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
