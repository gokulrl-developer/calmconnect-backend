import { UserResendOtpDTO } from "../dtos/user.dto";

export interface IResendOtpSignUpUserUseCase {
  execute(dto: UserResendOtpDTO): Promise<void>;
}
