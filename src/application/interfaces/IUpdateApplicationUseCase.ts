import { UpdateApplicationStatusDTO } from "../../domain/dtos/admin.dto";


export default interface IUpdateApplicationUseCase{
    execute(dto:UpdateApplicationStatusDTO):Promise<void>
}