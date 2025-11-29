import { Types } from "mongoose";
import Transaction from "../../../domain/entities/transaction.entity.js";
import {
  TransactionModel,
  ITransactionDocument,
} from "../models/TransactionModel.js";
import { BaseRepository } from "./BaseRepository.js";
import ITransactionRepository, {
  PsychRevenueTrendsEntry,
  RecentUserTransactionEntryFromPersistence,
  RevenueSummary,
  RevenueSummaryByPsych,
  RevenueTrendsEntry,
} from "../../../domain/interfaces/ITransactionRepository.js";
import { startOfWeek, subWeeks } from "date-fns";
import { TransactionOwnerType } from "../../../domain/enums/TransactionOwnerType.js";
import { TransactionType } from "../../../domain/enums/TransactionType.js";
import { TransactionReferenceType } from "../../../domain/enums/TransactionReferenceType.js";
import { RevenueTrendsIntervalByAdmin } from "../../../domain/enums/RevenueTrendsIntervalByAdmin.js";

interface TransactionQuery {
  ownerId: string;
  ownerType: TransactionOwnerType;
  type?: TransactionType;
  referenceType?: TransactionReferenceType;
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

  protected toPersistence(
    entity: Partial<Transaction>
  ): Partial<ITransactionDocument> {
    return {
      walletId: new Types.ObjectId(entity.walletId),
      ownerId: entity.ownerId,
      ownerType: entity.ownerType,
      sourceId: entity.sourceId,
      sourceType: entity.sourceType,
      recipientId: entity.recipientId,
      recipientType: entity.recipientType,
      type: entity.type,
      amount: entity.amount,
      sessionId: entity.sessionId
        ? new Types.ObjectId(entity.sessionId)
        : undefined,
      providerPaymentId: entity.providerPaymentId,
      referenceType: entity.referenceType,
      description: entity.description,
      _id: entity.id ? new Types.ObjectId(entity.id) : undefined,
    };
  }

  getISOWeek(date: Date): number {
  const temp = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
  const week1 = new Date(temp.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((temp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  );
}
  async listByOwner(
    ownerId: string,
    ownerType: TransactionOwnerType,
    type?: TransactionType,
    referenceType?: TransactionReferenceType,
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
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);

    return {
      transactions: docs.map((doc) => this.toDomain(doc)),
      totalItems,
    };
  }

  async fetchRevenueTrends(
    fromDate: Date,
    toDate: Date,
    interval: RevenueTrendsIntervalByAdmin
  ): Promise<RevenueTrendsEntry[]> {
    const dateFormat =
      interval === RevenueTrendsIntervalByAdmin.DAY ? "%Y-%m-%d" : interval === RevenueTrendsIntervalByAdmin.MONTH ? "%Y-%m" : "%Y";

    const results = await this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
          type: TransactionType.CREDIT,
          ownerType: TransactionOwnerType.PLATFORM, 
        },
      },
      {
        $group: {
          _id: {
            label: {
              $dateToString: { format: dateFormat, date: "$createdAt" },
            },
          },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.label": 1 } },
      { $project: { _id: 0, label: "$_id.label", revenue: 1 } },
    ]);

    return results;
  }

  async fetchRevenueSummary(
    fromDate: Date,
    toDate: Date
  ): Promise<RevenueSummary> {
    const totalValuePromise = this.model.aggregate([
      { $match: { type: TransactionType.CREDIT, ownerType: TransactionOwnerType.PLATFORM } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const addedValuePromise = this.model.aggregate([
      {
        $match: {
          type: TransactionType.CREDIT,
          ownerType:TransactionOwnerType.PLATFORM,
          createdAt: { $gte: fromDate, $lte: toDate },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const [totalResult, addedResult] = await Promise.all([
      totalValuePromise,
      addedValuePromise,
    ]);

    return {
      totalValue: totalResult[0]?.total || 0,
      addedValue: addedResult[0]?.total || 0,
    };
  }

  async fetchPsychRevenueTrends(psychId: string): Promise<PsychRevenueTrendsEntry[]> {

    const endDate = new Date();
  const startDate = subWeeks(startOfWeek(endDate, { weekStartsOn: 1 }), 4);

  const results = await this.model.aggregate([
    {
      $match: {
        ownerId: psychId,
        ownerType:TransactionOwnerType.PSYCHOLOGIST,
        type: TransactionType.CREDIT,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $isoWeek: "$createdAt" },
        revenue: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const filled: PsychRevenueTrendsEntry[] = [];
  const currentWeekDate = startOfWeek(endDate, { weekStartsOn: 1 });

  for (let i = 3; i >= 0; i--) {
    const weekDate = subWeeks(currentWeekDate, i);
    const weekNum = this.getISOWeek(weekDate);
    const found = results.find((r) => r._id === weekNum);

    filled.push({
      week: `Week ${weekNum}`,
      revenue: found ? found.revenue : 0,
    });
  }

  return filled;
}

  async fetchRevenueSummaryByPsych(psychId: string): Promise<RevenueSummaryByPsych> {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [currentResult, lastResult] = await Promise.all([
      this.model.aggregate([
        {
          $match: {
            ownerId: psychId,
            ownerType: TransactionOwnerType.PSYCHOLOGIST,
            type: TransactionType.CREDIT,
            createdAt: { $gte: startOfCurrentMonth, $lte: now },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      this.model.aggregate([
        {
          $match: {
            ownerId: psychId,
            ownerType: TransactionOwnerType.PSYCHOLOGIST,
            type: TransactionType.CREDIT,
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    return {
      current: currentResult[0]?.total || 0,
      lastMonth: lastResult[0]?.total || 0,
    };
  }

 async fetchRecentUserTransactions(
  userId: string,
  limit: number
): Promise<RecentUserTransactionEntryFromPersistence[]> {
  const results = await this.model.aggregate([
    {
      $match: {
        ownerId: userId,
        ownerType: TransactionOwnerType.USER,
        type: { $in: Object.values(TransactionType) },
        referenceType: { $in: [TransactionReferenceType.BOOKING, TransactionReferenceType.REFUND] },
      },
    },

    {
      $lookup: {
        from: "sessions",
        localField: "sessionId",
        foreignField: "_id",
        as: "sessionData",
      },
    },
    { $unwind: { path: "$sessionData", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "psychologists",
        localField: "sessionData.psychologist",
        foreignField: "_id",
        as: "psychologistData",
      },
    },
    { $unwind: { path: "$psychologistData", preserveNullAndEmptyArrays: true } },

    { $sort: { createdAt: -1 } },
    { $limit: limit },

    {
      $project: {
        transactionId: "$_id",
        time: "$createdAt",
        type: 1,
        referenceType: 1,
        psychFirstName: "$psychologistData.firstName",
        psychLastName: "$psychologistData.lastName",
      },
    },
  ]);

  return results;
}
}
