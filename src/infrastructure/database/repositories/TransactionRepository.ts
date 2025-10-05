import { Types } from "mongoose";
import Transaction from "../../../domain/entities/transaction.entity";
import IBaseRepository from "../../../domain/interfaces/IBaseRepository";
import { TransactionModel, ITransactionDocument } from "../models/TransactionModel";
import { BaseRepository } from "./BaseRepository";

export default class TransactionRepository
  extends BaseRepository<Transaction, ITransactionDocument>
  implements IBaseRepository<Transaction>
{
  constructor() {
    super(TransactionModel);
  }

  protected toDomain(doc: ITransactionDocument): Transaction {
    const transaction = doc.toObject();
    return new Transaction(
      transaction.walletId.toString(),
      transaction.type,
      transaction.amount,
      transaction.source,
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
      walletId: entity.walletId ? new Types.ObjectId(entity.walletId) : undefined,
      type: entity.type,
      amount: entity.amount,
      source: entity.source,
      sessionId: entity.sessionId ? new Types.ObjectId(entity.sessionId) : undefined,
      providerPaymentId: entity.providerPaymentId,
      referenceType: entity.referenceType,
      description: entity.description,
      _id: entity.id ? new Types.ObjectId(entity.id) : undefined,
    };
  }
}
