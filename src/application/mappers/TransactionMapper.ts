import Transaction from "../../domain/entities/transaction.entity";
import { Types } from "mongoose";

export const toDomainBookingDebit = (
  userWalletId: string,
  amount: number,
  sessionId: string,
  providerPaymentId?: string
): Transaction => {
  return new Transaction(
    userWalletId,
    "debit",
    amount,
    "user",
    sessionId,
    providerPaymentId,
    "booking",
    "User booking payment"
  );
};

export const toDomainBookingCredit = (
  adminWalletId: string,
  amount: number,
  sessionId: string,
  providerPaymentId?: string
): Transaction => {
  return new Transaction(
    adminWalletId,
    "credit",
    amount,
    "admin",
    sessionId,
    providerPaymentId,
    "booking",
    "Platform received booking payment"
  );
};

export const toDomainRefundDebit = (
  adminWalletId:string,
  amount: number,
  sessionId: string
): Transaction => {
  return new Transaction(
    adminWalletId,
    "debit",
    amount,
    "admin",
    sessionId,
    undefined,
    "refund",
    "Refund issued from platform"
  );
};

export const toDomainRefundCredit = (
  userWalletId: string,
  amount: number,
  sessionId: string
): Transaction => {
  return new Transaction(
    userWalletId,
    "credit",
    amount,
    "user",
    sessionId,
    undefined,
    "refund",
    "Refund credited to user"
  );
};

export const toDomainPayoutDebit = (
  adminWalletId: string,
  amount: number,
  sessionId: string
): Transaction => {
  return new Transaction(
    adminWalletId,
    "debit",
    amount,
    "admin",
    sessionId,
    undefined,
    "psychologistPayment",
    "Payout to psychologist"
  );
};

export const toDomainPayoutCredit = (
  psychologistWalletId:string,
  amount: number,
  sessionId: string
): Transaction => {
  return new Transaction(
    psychologistWalletId,
    "credit",
    amount,
    "psychologist",
    sessionId,
    undefined,
    "psychologistPayment",
    "Psychologist received payout"
  );
};
