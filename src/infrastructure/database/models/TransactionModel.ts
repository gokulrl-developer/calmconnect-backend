import { model, Schema, Document, Types } from "mongoose";

export interface ITransactionDocument extends Document {
  walletId: Types.ObjectId;
  type: "credit" | "debit";
  amount: number;
  source: "user" | "psychologist" | "admin" | "other";
  sessionId:Types.ObjectId;
  providerPaymentId?:string;
  referenceType?: "booking" | "psychologistPayment" | "refund" | "other";
  description?: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true },
    source: {
      type: String,
      enum: ["user", "psychologist", "admin", "other"],
      required: true,
    },
    sessionId:{type:Schema.Types.ObjectId},
    providerPaymentId: { type: String}, 
    referenceType: {
      type: String,
      enum: ["booking", "psychologistPayment", "refund", "other"],
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
