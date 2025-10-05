import { Types } from "mongoose";
import Wallet from "../../../domain/entities/wallet.entity";
import IWalletRepository from "../../../domain/interfaces/IWalletRepository";
import { WalletModel, IWalletDocument } from "../models/WalletModel";
import { BaseRepository } from "./BaseRepository";

export default class WalletRepository 
  extends BaseRepository<Wallet, IWalletDocument>
  implements IWalletRepository 
{
  constructor() {
    super(WalletModel);
  }

  protected toDomain(doc: IWalletDocument): Wallet {
    const wallet = doc.toObject();
    return new Wallet(
      wallet.ownerType,
      wallet.balance,
      wallet.ownerId?.toString(),
      wallet._id.toString()
    );
  }

  protected toPersistence(entity: Partial<Wallet>): Partial<IWalletDocument> {
    return {
      ownerType: entity.ownerType,
      balance: entity.balance,
      ownerId: entity.ownerId ? new Types.ObjectId(entity.ownerId) : undefined,
      _id: entity.id ? new Types.ObjectId(entity.id) : undefined,
    };
  }
}
