
import { ListPsychDTO } from "../dtos/admin.dto";

export default interface IPsychListUseCase {
execute(dto: ListPsychDTO): Promise<any[]>;
}