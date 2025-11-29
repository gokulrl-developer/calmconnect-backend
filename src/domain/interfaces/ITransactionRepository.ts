import Transaction from "../entities/transaction.entity.js";
import { RevenueTrendsIntervalByAdmin } from "../enums/RevenueTrendsIntervalByAdmin.js";
import { TransactionReferenceType } from "../enums/TransactionReferenceType.js";
import { TransactionType } from "../enums/TransactionType.js";
import IBaseRepository from "./IBaseRepository.js";

export interface RevenueTrendsEntry {
  label: string; //month,day
  revenue: number;
}

export default interface ITransactionRepository
  extends IBaseRepository<Transaction> {
  listByOwner(
    ownerId: string,
    ownerType: string,
    type?: TransactionType,
    referenceType?: TransactionReferenceType,
    date?: string,
    skip?: number,
    limit?: number
  ): Promise<{ transactions: Transaction[]; totalItems: number }>;
  fetchRevenueTrends(
    fromDate: Date,
    toDate: Date,
    interval: RevenueTrendsIntervalByAdmin
  ): Promise<RevenueTrendsEntry[]>;
  fetchRevenueSummary(fromDate: Date, toDate: Date): Promise<RevenueSummary>;
  fetchPsychRevenueTrends(psychId: string): Promise<PsychRevenueTrendsEntry[]>;

  fetchRevenueSummaryByPsych(psychId: string): Promise<RevenueSummaryByPsych>;
  fetchRecentUserTransactions(
    userId: string,
    limit: number
  ): Promise<RecentUserTransactionEntryFromPersistence[]>;
}

export interface RevenueSummary {
  totalValue: number; // all time total count , without deducting the psychologist payout
  addedValue: number; // added value in this time range  without deducting the psychologist payout
}

export interface PsychRevenueTrendsEntry {
  week: string; // day or week or month
  revenue: number;
}

export interface RevenueSummaryByPsych {
  current: number;
  lastMonth: number;
}
export interface RecentUserTransactionEntryFromPersistence {
  transactionId: string;
  time: string;
  type: TransactionType;
  referenceType?: TransactionReferenceType.BOOKING|TransactionReferenceType.REFUND;
  psychFirstName: string;
  psychLastName: string;
}
