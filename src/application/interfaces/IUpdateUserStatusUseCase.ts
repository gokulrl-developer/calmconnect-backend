import { UpdateUserStatusDTO } from "../../domain/dtos/admin.dto";

export default interface IUpdateUserStatusUseCase {
execute(dto: UpdateUserStatusDTO): Promise<void>;
}