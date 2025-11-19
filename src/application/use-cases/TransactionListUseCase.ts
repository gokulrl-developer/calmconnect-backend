import ITransactionRepository from "../../domain/interfaces/ITransactionRepository.js";
import { GetTransactionsDTO } from "../dtos/shared.dto.js";
import ITransactionListUseCase, { TransactionListResponse } from "../interfaces/IFetchTransactionsUseCase.js";
import { toTransactionListItem } from "../mappers/TransactionMapper.js";
import { calculatePagination } from "../utils/calculatePagination.js";

export default class GetTransactionListUseCase
  implements ITransactionListUseCase
{
  constructor(
    private readonly _transactionRepo: ITransactionRepository,
) {}

  async execute(dto: GetTransactionsDTO): Promise<TransactionListResponse> {
    const { ownerType, ownerId,type,referenceType,date, skip = 0, limit = 10 } = dto; 
    const { transactions, totalItems } =
      await this._transactionRepo.listByOwner(
        ownerId,
        ownerType,
        type,
        referenceType,
        date,
        skip,
        limit
      );
    return {
      transactions: transactions.map(toTransactionListItem),
      paginationData: calculatePagination(totalItems, skip, limit),
    };
  }
}
