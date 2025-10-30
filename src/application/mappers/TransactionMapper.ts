import Transaction from "../../domain/entities/transaction.entity";
import { TransactionListItem } from "../interfaces/IFetchTransactionsUseCase";


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
    "user", // ownerType
    ownerId, // sourceId
    "user", // sourceType
    recipientId, // recipientId
    "platform", // recipientType
    "debit",
    amount,
    sessionId,
    providerPaymentId,
    "booking",
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
    "platform", // ownerType
    sourceId,
    "user", // sourceType
    ownerId,
    "platform", // recipientType
    "credit",
    amount,
    sessionId,
    providerPaymentId,
    "booking",
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
    "platform",
    ownerId,
    "platform",
    recipientId,
    "user",
    "debit",
    amount,
    sessionId,
    undefined,
    "refund",
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
    "user",
    sourceId,
    "platform",
    ownerId,
    "user",
    "credit",
    amount,
    sessionId,
    undefined,
    "refund",
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
    "platform",
    ownerId,
    "platform",
    recipientId,
    "psychologist",
    "debit",
    amount,
    sessionId,
    undefined,
    "psychologistPayment",
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
    "psychologist",
    sourceId,
    "platform",
    ownerId,
    "psychologist",
    "credit",
    amount,
    sessionId,
    undefined,
    "psychologistPayment",
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
