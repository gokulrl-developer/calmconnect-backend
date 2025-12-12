import { TransactionOwnerType } from "../enums/TransactionOwnerType.js";
import { TransactionRecipientType } from "../enums/TransactionRecipientType.js";
import { TransactionReferenceType } from "../enums/TransactionReferenceType.js";
import { TransactionSourceType } from "../enums/TransactionSourceType.js";
import { TransactionType } from "../enums/TransactionType.js";

export default class Transaction {
  constructor(
    public walletId:string,
    public ownerId:string,
    public ownerType:TransactionOwnerType,       
    public sourceId: string,
    public sourceType:TransactionSourceType,
    public recipientId: string, 
    public recipientType:TransactionRecipientType,
    public type: TransactionType,              
    public amount: number,                         
    public sessionId:string,
    public providerPaymentId?: string, 
    public referenceType?: TransactionReferenceType,
    public description?: string,                   
    public createdAt?: Date,
    public id?:string                        
  ) {
    this.createdAt = createdAt ?? new Date();
  }
}
