import { UserResendOtpDTO } from "../../domain/dtos/user.dto";

export interface IResendOtpResetUserUseCase {
  execute(dto: UserResendOtpDTO): Promise<void>;
}
