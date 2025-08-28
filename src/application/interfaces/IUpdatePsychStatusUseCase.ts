import { UpdatePsychStatusDTO } from "../../domain/dtos/admin.dto";

export default interface IUpdatePsychStatusUseCase {
execute(dto: UpdatePsychStatusDTO): Promise<void>;
}