import { AdminLoginDTO } from "../dtos/admin.dto.js";
import { AdminLoginResponse } from "../use-cases/admin/LoginAdminUseCase.js";

export interface ILoginAdminUseCase {
  execute(dto: AdminLoginDTO): Promise<AdminLoginResponse>;
}