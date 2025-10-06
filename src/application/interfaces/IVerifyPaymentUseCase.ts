import { VerifyPaymentDTO } from "../dtos/user.dto";

export interface VerifyPaymentResponse {
  success: boolean;
}

export default interface IVerifyPaymentUseCase {
  execute(dto: VerifyPaymentDTO): Promise<VerifyPaymentResponse>;
}
