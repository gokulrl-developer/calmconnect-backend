import { UserResendOtpDTO } from "../dtos/user.dto";

export interface IResendOtpResetUserUseCase {
  execute(dto: UserResendOtpDTO): Promise<void>;
}
