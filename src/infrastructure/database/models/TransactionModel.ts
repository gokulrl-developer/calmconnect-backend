import { model, Schema, Document, Types } from "mongoose";
import { TransactionOwnerType } from "../../../domain/enums/TransactionOwnerType.js";
import { TransactionSourceType } from "../../../domain/enums/TransactionSourceType.js";
import { TransactionRecipientType } from "../../../domain/enums/TransactionRecipientType.js";
import { TransactionType } from "../../../domain/enums/TransactionType.js";
import { TransactionReferenceType } from "../../../domain/enums/TransactionReferenceType.js";

export interface ITransactionDocument extends Document {
  walletId: Types.ObjectId;
  ownerId:string;
  sourceId:string;
  recipientId:string;
  ownerType:TransactionOwnerType;
  sourceType:TransactionSourceType;
  recipientType:TransactionRecipientType;
  type: TransactionType;
  amount: number;
  sessionId:Types.ObjectId;
  providerPaymentId?:string;
  referenceType?: TransactionReferenceType ;
  description?: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    ownerId: { type: String,required: true },
    ownerType: { type: String,enum: Object.values(TransactionOwnerType), required: true },
    sourceType: { type: String,enum: Object.values(TransactionSourceType), required: true },
    recipientType: { type: String,enum: Object.values(TransactionRecipientType), required: true },
    sourceId: { type: String,required: true },
    recipientId: { type: String,required: true },
    type: { type: String, enum: Object.values(TransactionType), required: true },
    amount: { type: Number, required: true },
    sessionId:{type:Schema.Types.ObjectId},
    providerPaymentId: { type: String}, 
    referenceType: {
      type: String,
      enum: Object.values(TransactionReferenceType),
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
