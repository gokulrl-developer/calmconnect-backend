import { UpdatePsychStatusDTO } from "../dtos/admin.dto.js";

export default interface IUpdatePsychStatusUseCase {
execute(dto: UpdatePsychStatusDTO): Promise<void>;
}