import { CreateReviewDTO } from "../dtos/user.dto";

export default interface ICreateReviewUseCase{
 execute(dto:CreateReviewDTO):Promise<void>
}