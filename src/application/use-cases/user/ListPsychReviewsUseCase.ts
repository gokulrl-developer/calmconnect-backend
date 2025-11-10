import IListPsychReviewsUseCase, {
  ListPsychReviewsResponse,
} from "../../interfaces/IListPsychReviewsUseCase";
import { ListPsychReviewsDTO } from "../../dtos/user.dto";
import IReviewRepository from "../../../domain/interfaces/IReviewRepository";
import { mapDomainToListPsychReviewsResponse } from "../../mappers/ReviewMapper";
import { calculatePagination } from "../../utils/calculatePagination";
import PaginationData from "../../utils/calculatePagination";

export default class ListPsychReviewsUseCase
  implements IListPsychReviewsUseCase
{
  constructor(private _reviewRepository: IReviewRepository) {}

  async execute(dto: ListPsychReviewsDTO): Promise<ListPsychReviewsResponse> {
    const { skip, limit } = dto;
    let { reviews, totalItems } = await this._reviewRepository.listPsychReviews(
      {
        psychId: dto.psychId,
        sort: dto.sort,
        skip,
        limit,
      }
    );

    const paginationData: PaginationData = calculatePagination(
      totalItems,
      skip,
      limit
    );

    return {
      paginationData,
      reviews: reviews.map(mapDomainToListPsychReviewsResponse),
    };
  }
}
