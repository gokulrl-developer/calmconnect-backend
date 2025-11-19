import { UpdateUserStatusDTO } from "../dtos/admin.dto.js";

export default interface IUpdateUserStatusUseCase {
execute(dto: UpdateUserStatusDTO): Promise<void>;
}