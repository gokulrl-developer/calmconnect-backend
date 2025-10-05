import { Types } from "mongoose";

export default class Transaction {
  constructor(
    public walletId:string,       
    public type: "credit" | "debit",              
    public amount: number,                         
    public source: "user" | "psychologist" | "admin" | "other", 
    public sessionId:string,
    public providerPaymentId?: string, 
    public referenceType?: "booking" | "psychologistPayment" | "refund" | "other",
    public description?: string,                   
    public createdAt?: Date,
    public id?:string                        
  ) {
    this.createdAt = createdAt ?? new Date();
  }
}
