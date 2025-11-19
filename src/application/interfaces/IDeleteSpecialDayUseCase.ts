import { DeleteSpecialDayDTO } from "../dtos/psych.dto.js";

export default interface IDeleteSpecialDayUseCase{
 execute(dto:DeleteSpecialDayDTO):Promise<void>
}