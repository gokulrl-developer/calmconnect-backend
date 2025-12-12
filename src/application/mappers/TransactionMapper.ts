import Transaction from "../../domain/entities/transaction.entity.js";
import { TransactionListItem } from "../interfaces/IFetchTransactionsUseCase.js";
import { 
  RevenueTrendsEntry as DomainRevenueTrendsEntry, 
  PsychRevenueTrendsEntry, 
  RecentUserTransactionEntryFromPersistence, 
  RevenueSummary, 
  RevenueSummaryByPsych, 
} from "../../domain/interfaces/ITransactionRepository.js";
import { RevenueTrendsEntry as ResponseRevenueTrendsEntry } from "../../application/interfaces/IFetchRevenueTrendsUseCase.js";
import { 
  PsychRevenueSummary, 
  RevenueTrendEntry as ResponsePsychRevenueTrendsEntry 
} from "../../application/interfaces/IFetchPsychDashboardUseCase.js";
import { SummaryCardItem } from "../interfaces/IFetchDashboardSummaryCardsAdminUseCase.js";
import { UserRecentTransactionsEntry } from "../interfaces/IFetchUserDashboardUseCase.js";
import { TransactionOwnerType } from "../../domain/enums/TransactionOwnerType.js";
import { TransactionSourceType } from "../../domain/enums/TransactionSourceType.js";
import { TransactionRecipientType } from "../../domain/enums/TransactionRecipientType.js";
import { TransactionType } from "../../domain/enums/TransactionType.js";
import { TransactionReferenceType } from "../../domain/enums/TransactionReferenceType.js";


export const toDomainBookingDebit = (
  userWalletId: string,
  ownerId: string, // user
  recipientId: string, // platform
  amount: number,
  sessionId: string,
  providerPaymentId?: string
): Transaction => {
  return new Transaction(
    userWalletId,
    ownerId,
    TransactionOwnerType.USER, // ownerType
    ownerId, // sourceId
    TransactionSourceType.USER, // sourceType
    recipientId, // recipientId
    TransactionRecipientType.PLATFORM, // recipientType
    TransactionType.DEBIT,
    amount,
    sessionId,
    providerPaymentId,
    TransactionReferenceType.BOOKING,
    "User booking payment"
  );
};


export const toDomainBookingCredit = (
  adminWalletId: string,
  ownerId: string, // platform
  sourceId: string, // user
  amount: number,
  sessionId: string,
  providerPaymentId?: string
): Transaction => {
  return new Transaction(
    adminWalletId,
    ownerId,
    TransactionOwnerType.PLATFORM, // ownerType
    sourceId,
    TransactionSourceType.USER, // sourceType
    ownerId,
    TransactionRecipientType.PLATFORM, // recipientType
    TransactionType.CREDIT,
    amount,
    sessionId,
    providerPaymentId,
    TransactionReferenceType.BOOKING,
    "Platform received booking payment"
  );
};


export const toDomainRefundDebit = (
  adminWalletId: string,
  ownerId: string, // platform
  recipientId: string, // user
  amount: number,
  sessionId: string
): Transaction => {
  return new Transaction(
    adminWalletId,
    ownerId,
    TransactionOwnerType.PLATFORM,
    ownerId,
    TransactionSourceType.PLATFORM,
    recipientId,
    TransactionRecipientType.USER,
    TransactionType.DEBIT,
    amount,
    sessionId,
    undefined,
    TransactionReferenceType.REFUND,
    "Refund issued from platform"
  );
};


export const toDomainRefundCredit = (
  userWalletId: string,
  ownerId: string, // user
  sourceId: string, // platform
  amount: number,
  sessionId: string
): Transaction => {
  return new Transaction(
    userWalletId,
    ownerId,
    TransactionOwnerType.USER,
    sourceId,
    TransactionSourceType.PLATFORM,
    ownerId,
    TransactionRecipientType.USER,
    TransactionType.CREDIT,
    amount,
    sessionId,
    undefined,
    TransactionReferenceType.REFUND,
    "Refund credited to user"
  );
};


export const toDomainPayoutDebit = (
  adminWalletId: string,
  ownerId: string, // platform
  recipientId: string, // psychologist
  amount: number,
  sessionId: string
): Transaction => {
  return new Transaction(
    adminWalletId,
    ownerId,
    TransactionOwnerType.PLATFORM,
    ownerId,
    TransactionSourceType.PLATFORM,
    recipientId,
    TransactionRecipientType.PSYCHOLOGIST,
    TransactionType.DEBIT,
    amount,
    sessionId,
    undefined,
    TransactionReferenceType.PSYCHOLOGIST_PAYMENT,
    "Payout to psychologist"
  );
};


export const toDomainPayoutCredit = (
  psychologistWalletId: string,
  ownerId: string, // psychologist
  sourceId: string, // platform
  amount: number,
  sessionId: string
): Transaction => {
  return new Transaction(
    psychologistWalletId,
    ownerId,
    TransactionOwnerType.PSYCHOLOGIST,
    sourceId,
    TransactionSourceType.PLATFORM,
    ownerId,
    TransactionRecipientType.PSYCHOLOGIST,
    TransactionType.CREDIT,
    amount,
    sessionId,
    undefined,
    TransactionReferenceType.PSYCHOLOGIST_PAYMENT,
    "Psychologist received payout"
  );
};


export const toTransactionListItem = (
  transaction: Transaction
): TransactionListItem => {
  return {
    transactionId: transaction.id!,
    type: transaction.type,
    amount: transaction.amount,
    referenceType: transaction.referenceType,
    createdAt: transaction.createdAt!,
  };
};

export const toRevenueTrendsResponse = (
  entry: DomainRevenueTrendsEntry
): ResponseRevenueTrendsEntry => {
  return {
    label: entry.label, 
    revenue: entry.revenue,
  };
};

export const mapRevenueSummaryToCardItem = (summary: RevenueSummary): SummaryCardItem => ({
  totalValue: summary.totalValue,
  addedValue: summary.addedValue,
});

export const mapPsychRevenueTrendsToResponse = (
  entry: PsychRevenueTrendsEntry
): ResponsePsychRevenueTrendsEntry => ({
  week: entry.week,
  revenue: entry.revenue,
});

export const mapRevenueSummaryToResponse = (
  summary: PsychRevenueSummary
): RevenueSummaryByPsych => ({
  current: summary.current,
  lastMonth: summary.lastMonth,
});

export const mapRecentUserTransactionsFromPersistence = (
  entry: RecentUserTransactionEntryFromPersistence
): UserRecentTransactionsEntry =>
  {return{
    transactionId: entry.transactionId,
    time: entry.time,
    type: entry.type,
    referenceType: entry.referenceType,
    psychFirstName: entry.psychFirstName,
    psychLastName: entry.psychLastName,
  }};