import Transaction from "../entities/transaction.entity.js";
import { TransactionRecipientType } from "../enums/TransactionRecipientType.js";
import { TransactionSourceType } from "../enums/TransactionSourceType.js";

export interface SourceData{
  name?:string,
  email?:string,
  type:TransactionSourceType
}
export interface RecipientData{
  name?:string,
  email?:string,
  type:TransactionRecipientType
}
export interface IReceiptService {
  generateTransactionReceipt(
    transaction: Transaction,source:SourceData,recipient:RecipientData
  ): Promise<Buffer>; 
}