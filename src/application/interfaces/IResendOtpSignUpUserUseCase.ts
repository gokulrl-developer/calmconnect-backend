import { UserResendOtpDTO } from "../dtos/user.dto.js";

export interface IResendOtpSignUpUserUseCase {
  execute(dto: UserResendOtpDTO): Promise<void>;
}
