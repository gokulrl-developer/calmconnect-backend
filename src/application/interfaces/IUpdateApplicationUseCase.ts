import { UpdateApplicationStatusDTO } from "../dtos/admin.dto.js";


export default interface IUpdateApplicationUseCase{
    execute(dto:UpdateApplicationStatusDTO):Promise<void>
}