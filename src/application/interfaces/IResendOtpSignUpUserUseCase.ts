import { UserResendOtpDTO } from "../../domain/dtos/user.dto";

export interface IResendOtpSignUpUserUseCase {
  execute(dto: UserResendOtpDTO): Promise<void>;
}
