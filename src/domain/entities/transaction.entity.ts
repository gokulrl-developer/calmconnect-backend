import { Types } from "mongoose";

export default class Transaction {
  constructor(
    public walletId:string,
    public ownerId:string,
    public ownerType:"user" | "psychologist" |"platform",       
    public sourceId: string,
    public sourceType:"user" | "psychologist" |"platform",
    public recipientId: string, 
    public recipientType:"user" | "psychologist" |"platform",
    public type: "credit" | "debit",              
    public amount: number,                         
    public sessionId:string,
    public providerPaymentId?: string, 
    public referenceType?: "booking" | "psychologistPayment" | "refund",
    public description?: string,                   
    public createdAt?: Date,
    public id?:string                        
  ) {
    this.createdAt = createdAt ?? new Date();
  }
}
