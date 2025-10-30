import Transaction from "../entities/transaction.entity";

export interface SourceData{
  name?:string,
  email?:string,
  type:"psychologist"|"user"|"platform"
}
export interface RecipientData{
  name?:string,
  email?:string,
  type:"psychologist"|"user"|"platform"
}
export interface IReceiptService {
  generateTransactionReceipt(
    transaction: Transaction,source:SourceData,recipient:RecipientData
  ): Promise<Buffer>; 
}