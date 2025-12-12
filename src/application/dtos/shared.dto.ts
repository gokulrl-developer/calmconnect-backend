import { NotificationRecipientType } from "../../domain/enums/NotificationRecipientType.js";
import { TransactionOwnerType } from "../../domain/enums/TransactionOwnerType.js";
import { TransactionReferenceType } from "../../domain/enums/TransactionReferenceType.js";
import { TransactionType } from "../../domain/enums/TransactionType.js";
import { WalletOwnerType } from "../../domain/enums/WalletOwnerType.js";

export interface CheckSessionAccessDTO {
  sessionId: string;
  userId?: string;
  psychId?: string;
}

export interface PostMessageDTO {
  sessionId: string;
  text: string;
  userId?: string;
  psychId?: string;
}

export interface GetMessagesDTO {
  sessionId: string;
}

export interface GetNotificationsDTO {
  recipientType: NotificationRecipientType;
  recipientId: string;
  skip?: number;
  limit?: number;
}

export interface MarkNotificationsReadDTO {
  recipientType: NotificationRecipientType;
  recipientId: string;
}
export interface GetUnreadNotificationsCountDTO {
  recipientType: NotificationRecipientType;
  recipientId: string;
}

export interface GetWalletDTO{
  ownerType: WalletOwnerType;
  ownerId: string;
}

export interface GetTransactionsDTO{
  ownerType: TransactionOwnerType;
  ownerId: string;
  type?:TransactionType,
  referenceType?:TransactionReferenceType,
  date?:string,
  skip?:number;
  limit?:number
}

export interface GetTransactionReceiptDTO{
  ownerType: TransactionOwnerType;
  ownerId: string;
  transactionId:string;
}

export interface ClearNotificationsDTO {
  recipientType: NotificationRecipientType;
  recipientId: string;
}