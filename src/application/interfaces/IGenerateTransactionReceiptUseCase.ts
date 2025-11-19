import { GetTransactionReceiptDTO } from "../dtos/shared.dto.js";

export default interface IGenerateTransactionReceiptUseCase {
  execute(dto:GetTransactionReceiptDTO): Promise<Buffer>;
}
