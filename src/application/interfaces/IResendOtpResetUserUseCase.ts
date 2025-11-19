import { UserResendOtpDTO } from "../dtos/user.dto.js";

export interface IResendOtpResetUserUseCase {
  execute(dto: UserResendOtpDTO): Promise<void>;
}
