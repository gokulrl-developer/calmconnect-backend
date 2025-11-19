import { VerifyPaymentDTO } from "../dtos/user.dto.js";

export interface VerifyPaymentResponse {
  success: boolean;
}

export default interface IVerifyPaymentUseCase {
  execute(dto: VerifyPaymentDTO): Promise<VerifyPaymentResponse>;
}
