
import { ListPsychDTO } from "../dtos/admin.dto.js";

export interface AdminPsychListResponseItem{
    id:string,
    firstName:string,
    lastName:string,
    status:"active"|"inactive",
    email:string
}

export default interface IPsychListUseCase {
execute(dto: ListPsychDTO): Promise<AdminPsychListResponseItem[]>;
}