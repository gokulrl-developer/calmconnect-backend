import IListPsychReviewsUseCase, {
  ListPsychReviewsResponse,
} from "../../interfaces/IListPsychReviewsUseCase.js";
import { ListPsychReviewsDTO } from "../../dtos/user.dto.js";
import IReviewRepository from "../../../domain/interfaces/IReviewRepository.js";
import { mapDomainToListPsychReviewsResponse } from "../../mappers/ReviewMapper.js";
import PaginationData, { calculatePagination } from "../../utils/calculatePagination.js";

export default class ListPsychReviewsUseCase
  implements IListPsychReviewsUseCase
{
  constructor(private _reviewRepository: IReviewRepository) {}

  async execute(dto: ListPsychReviewsDTO): Promise<ListPsychReviewsResponse> {
    const { skip, limit } = dto;
    const { reviews, totalItems } = await this._reviewRepository.listPsychReviews(
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
