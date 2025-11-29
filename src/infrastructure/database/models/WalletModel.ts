import { model, Schema, Document } from "mongoose";
import { WalletOwnerType } from "../../../domain/enums/WalletOwnerType.js";

export interface IWalletDocument extends Document {
  ownerType: WalletOwnerType;
  balance: number;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWalletDocument>(
  {
    ownerType: {
      type: String,
      enum: Object.values(WalletOwnerType),
      required: true,
    },
    balance: { type: Number, required: true, default: 0 },
    ownerId: { type: String, refPath: "ownerType" }, 
  },
  {
    timestamps: true, 
  }
);

export const WalletModel = model<IWalletDocument>("Wallet", WalletSchema);
