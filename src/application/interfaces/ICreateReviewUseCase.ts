import { CreateReviewDTO } from "../dtos/user.dto.js";

export default interface ICreateReviewUseCase{
 execute(dto:CreateReviewDTO):Promise<void>
}