import { model, Schema, Document } from "mongoose";

export interface IWalletDocument extends Document {
  ownerType: "user" | "psychologist" | "platform";
  balance: number;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWalletDocument>(
  {
    ownerType: {
      type: String,
      enum: ["user", "psychologist", "platform"],
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
