import { GetTransactionReceiptDTO } from "../dtos/shared.dto";

export default interface IGenerateTransactionReceiptUseCase {
  execute(dto:GetTransactionReceiptDTO): Promise<Buffer>;
}
