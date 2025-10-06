import { PsychApplicationStatusDTO } from "../dtos/psych.dto";

export default interface IApplicationStatusUseCase{
    execute(dto:PsychApplicationStatusDTO):Promise<{status:"pending"|"accepted"|"rejected"|null}>
}