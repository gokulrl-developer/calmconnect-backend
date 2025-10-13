import { CreateSpecialDayDTO } from "../dtos/psych.dto";

export default interface ICreateSpecialDayUseCase{
    execute(dto:CreateSpecialDayDTO):Promise<void>
}