import { CreateSpecialDayDTO } from "../dtos/psych.dto.js";

export default interface ICreateSpecialDayUseCase{
    execute(dto:CreateSpecialDayDTO):Promise<void>
}