import { model, Schema, Document, Types } from "mongoose";

export interface IWalletDocument extends Document {
  ownerType: "user" | "psychologist" | "admin";
  balance: number;
  ownerId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWalletDocument>(
  {
    ownerType: {
      type: String,
      enum: ["user", "psychologist", "admin"],
      required: true,
    },
    balance: { type: Number, required: true, default: 0 },
    ownerId: { type: Schema.Types.ObjectId, refPath: "ownerType" }, 
  },
  {
    timestamps: true, 
  }
);

export const WalletModel = model<IWalletDocument>("Wallet", WalletSchema);
