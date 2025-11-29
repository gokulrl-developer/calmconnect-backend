import { RevenueTrendsIntervalByAdmin } from "../../../domain/enums/RevenueTrendsIntervalByAdmin.js";
import ITransactionRepository, { RevenueTrendsEntry } from "../../../domain/interfaces/ITransactionRepository.js";
import { FetchRevenueTrendsDTO } from "../../dtos/admin.dto.js";
import IFetchRevenueTrendsUseCase from "../../interfaces/IFetchRevenueTrendsUseCase.js";
import { toRevenueTrendsResponse } from "../../mappers/TransactionMapper.js";
import { generateLabels } from "../../utils/generateLabels.js";

export default class FetchRevenueTrendsUseCase implements IFetchRevenueTrendsUseCase{
    constructor(
     private readonly _transactionRepository:ITransactionRepository
    ){}
    async execute(dto:FetchRevenueTrendsDTO){
      let interval: string;
    const startDate = new Date(dto.fromDate);
    const endDate = new Date(dto.toDate);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const diffMonths = diffDays / 30; 
    const diffYears = diffMonths / 12;

    if (diffYears > 1) {
      interval = RevenueTrendsIntervalByAdmin.YEAR;
    } else if (diffMonths > 1) {
      interval = RevenueTrendsIntervalByAdmin.MONTH;
    } else {
      interval = RevenueTrendsIntervalByAdmin.DAY;
    }
      const entries= await this._transactionRepository.fetchRevenueTrends(startDate,endDate,interval as RevenueTrendsIntervalByAdmin);
     const labels = generateLabels(startDate, endDate, interval as "year"|"month"|"day");

    const filledEntries: RevenueTrendsEntry[] = labels.map(label => {
      const found = entries.find(e => e.label === label);
      return found
        ? { ...found, revenue: (found.revenue * 10) / 100 } 
        : { label, revenue: 0 };
    });

    return filledEntries.map(toRevenueTrendsResponse);
    }
}