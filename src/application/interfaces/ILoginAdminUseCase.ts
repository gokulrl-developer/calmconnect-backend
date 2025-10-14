import { AdminLoginDTO } from "../dtos/admin.dto";
import { AdminLoginResponse } from "../use-cases/admin/LoginAdminUseCase";

export interface ILoginAdminUseCase {
  execute(dto: AdminLoginDTO): Promise<AdminLoginResponse>;
}