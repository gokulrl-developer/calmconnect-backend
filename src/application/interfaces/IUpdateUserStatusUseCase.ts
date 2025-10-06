import { UpdateUserStatusDTO } from "../dtos/admin.dto";

export default interface IUpdateUserStatusUseCase {
execute(dto: UpdateUserStatusDTO): Promise<void>;
}