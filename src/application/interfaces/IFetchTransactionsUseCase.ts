
import { TransactionReferenceType } from "../../domain/enums/TransactionReferenceType.js";
import { TransactionType } from "../../domain/enums/TransactionType.js";
import { GetTransactionsDTO } from "../dtos/shared.dto.js";
import PaginationData from "../utils/calculatePagination.js";

export interface TransactionListItem {
  transactionId: string;
  type: TransactionType;
  amount: number;
  referenceType?: TransactionReferenceType;
  createdAt: Date;
}

export interface TransactionListResponse{
  transactions:TransactionListItem[];
  paginationData:PaginationData
}

export default interface ITransactionListUseCase {
  execute(dto: GetTransactionsDTO): Promise<TransactionListResponse>;
}
