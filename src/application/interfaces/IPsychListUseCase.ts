
import { ListPsychDTO } from "../dtos/admin.dto.js";

export default interface IPsychListUseCase {
execute(dto: ListPsychDTO): Promise<any[]>;
}