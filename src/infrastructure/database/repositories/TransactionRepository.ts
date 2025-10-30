import { Types } from "mongoose";
import Transaction from "../../../domain/entities/transaction.entity";
import { TransactionModel, ITransactionDocument } from "../models/TransactionModel";
import { BaseRepository } from "./BaseRepository";
import ITransactionRepository from "../../../domain/interfaces/ITransactionRepository";

interface TransactionQuery {
  ownerId: string;
  ownerType: "platform" | "user" | "psychologist";
  type?: "credit" | "debit";
  referenceType?: "booking" | "psychologistPayment" | "refund";
  createdAt?: { $gte: Date; $lte: Date };
}
export default class TransactionRepository
  extends BaseRepository<Transaction, ITransactionDocument>
  implements ITransactionRepository
{
  constructor() {
    super(TransactionModel);
  }

  protected toDomain(doc: ITransactionDocument): Transaction {
    const transaction = doc.toObject();
    return new Transaction(
      transaction.walletId.toString(),
      transaction.ownerId,
      transaction.ownerType,
      transaction.sourceId,
      transaction.sourceType,
      transaction.recipientId,
      transaction.recipientType,
      transaction.type,
      transaction.amount,
      transaction.sessionId.toString(),
      transaction.providerPaymentId,
      transaction.referenceType,
      transaction.description,
      transaction.createdAt,
      transaction._id.toString()
    );
  }

  protected toPersistence(entity: Partial<Transaction>): Partial<ITransactionDocument> {
    return {
      walletId: new Types.ObjectId(entity.walletId),
      ownerId: entity.ownerId,
      ownerType: entity.ownerType,
      sourceId:entity.sourceId,
      sourceType:entity.sourceType,
      recipientId:entity.recipientId,
      recipientType:entity.recipientType,
      type: entity.type,
      amount: entity.amount,
      sessionId: entity.sessionId ? new Types.ObjectId(entity.sessionId) : undefined,
      providerPaymentId: entity.providerPaymentId,
      referenceType: entity.referenceType,
      description: entity.description,
      _id: entity.id ? new Types.ObjectId(entity.id) : undefined,
    };
  }
 async listByOwner(
  ownerId: string,
  ownerType: "platform" | "user" | "psychologist",
  type?: "credit" | "debit",
  referenceType?: "booking" | "psychologistPayment" | "refund",
  date?: string, 
  skip = 0,
  limit = 50
): Promise<{ transactions: Transaction[]; totalItems: number }> {
  
  const filter: TransactionQuery = {
    ownerId,
    ownerType,
  };

  if (type) filter.type = type;
  if (referenceType) filter.referenceType = referenceType;

  if (date) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
  }

  const [docs, totalItems] = await Promise.all([
    this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    this.model.countDocuments(filter),
  ]);

  return {
    transactions: docs.map((doc) => this.toDomain(doc)),
    totalItems,
  };
}

}
