import PaginationData from "../../application/utils/calculatePagination";
import Transaction from "../entities/transaction.entity";
import IBaseRepository from "./IBaseRepository";

export default interface ITransactionRepository
  extends IBaseRepository<Transaction> {
  listByOwner(
    ownerId: string,
    ownerType: string,
    type?: "credit" | "debit",
    referenceType?: "booking" | "psychologistPayment" | "refund",
    date?: string,
    skip?: number,
    limit?: number
  ): Promise<{ transactions: Transaction[]; totalItems: number }>;
}
