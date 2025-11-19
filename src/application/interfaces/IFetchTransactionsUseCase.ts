
import { GetTransactionsDTO } from "../dtos/shared.dto.js";
import PaginationData from "../utils/calculatePagination.js";

export interface TransactionListItem {
  transactionId: string;
  type: "credit" | "debit";
  amount: number;
  referenceType?: "booking" | "psychologistPayment" | "refund";
  createdAt: Date;
}

export interface TransactionListResponse{
  transactions:TransactionListItem[];
  paginationData:PaginationData
}

export default interface ITransactionListUseCase {
  execute(dto: GetTransactionsDTO): Promise<TransactionListResponse>;
}
