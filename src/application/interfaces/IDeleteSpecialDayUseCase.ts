import { DeleteSpecialDayDTO } from "../dtos/psych.dto";

export default interface IDeleteSpecialDayUseCase{
 execute(dto:DeleteSpecialDayDTO):Promise<void>
}