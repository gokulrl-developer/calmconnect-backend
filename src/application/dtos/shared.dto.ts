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
  recipientType: "admin" | "user" | "psychologist";
  recipientId: string;
  skip?: number;
  limit?: number;
}

export interface MarkNotificationsReadDTO {
  recipientType: "admin" | "user" | "psychologist";
  recipientId: string;
}
export interface GetUnreadNotificationsCountDTO {
  recipientType: "admin" | "user" | "psychologist";
  recipientId: string;
}

export interface GetWalletDTO{
  ownerType: "platform" | "user" | "psychologist";
  ownerId: string;
}

export interface GetTransactionsDTO{
  ownerType: "platform" | "user" | "psychologist";
  ownerId: string;
  type?:"credit"|"debit",
  referenceType?:"booking" | "psychologistPayment" | "refund",
  date?:string,
  skip?:number;
  limit?:number
}

export interface GetTransactionReceiptDTO{
  ownerType: "platform" | "user" | "psychologist";
  ownerId: string;
  transactionId:string;
}

export interface ClearNotificationsDTO {
  recipientType: "admin" | "user" | "psychologist";
  recipientId: string;
}