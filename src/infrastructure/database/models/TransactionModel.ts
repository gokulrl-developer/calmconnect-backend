import { model, Schema, Document, Types } from "mongoose";

export interface ITransactionDocument extends Document {
  walletId: Types.ObjectId;
  ownerId:String;
  sourceId:String;
  recipientId:String;
  ownerType:"user"|"psychologist"|"platform";
  sourceType:"user"|"psychologist"|"platform";
  recipientType:"user"|"psychologist"|"platform";
  type: "credit" | "debit";
  amount: number;
  sessionId:Types.ObjectId;
  providerPaymentId?:string;
  referenceType?: "booking" | "psychologistPayment" | "refund" ;
  description?: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    ownerId: { type: String,required: true },
    ownerType: { type: String,enum: ["user", "psychologist", "platform"], required: true },
    sourceType: { type: String,enum: ["user", "psychologist", "platform"], required: true },
    recipientType: { type: String,enum: ["user", "psychologist", "platform"], required: true },
    sourceId: { type: String,required: true },
    recipientId: { type: String,required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true },
    sessionId:{type:Schema.Types.ObjectId},
    providerPaymentId: { type: String}, 
    referenceType: {
      type: String,
      enum: ["booking", "psychologistPayment", "refund"],
    },
    description: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, 
  }
);

export const TransactionModel = model<ITransactionDocument>(
  "Transaction",
  TransactionSchema
);
