import { EditSpecialDayDTO } from "../dtos/psych.dto.js";

export default interface IEditSpecialDayUseCase{
    execute(dto:EditSpecialDayDTO):Promise<void>
}