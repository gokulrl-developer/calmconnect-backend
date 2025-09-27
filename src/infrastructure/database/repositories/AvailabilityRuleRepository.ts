import { Types } from "mongoose";
import AvailabilityRule from "../../../domain/entities/availability-rule.entity";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import {
  AvailabilityRuleModel,
  IAvailabilityRuleDocument,
} from "../models/AvailabilityRuleModel";
import { BaseRepository } from "./BaseRepository";

export default class AvailabilityRuleRepository
  extends BaseRepository<AvailabilityRule, IAvailabilityRuleDocument>
  implements IAvailabilityRuleRepository
{
  constructor() {
    super(AvailabilityRuleModel);
  }

  protected toDomain(doc: IAvailabilityRuleDocument): AvailabilityRule {
    const availabilityRule = doc.toObject();
    return new AvailabilityRule(
      availabilityRule.psychologist,
      availabilityRule.startTime,
      availabilityRule.endTime,
      availabilityRule.startDate,
      availabilityRule.endDate,
      availabilityRule.durationInMins,
      availabilityRule.bufferTimeInMins,
      availabilityRule.quickSlots,
      availabilityRule.slotsOpenTime,
      availabilityRule.specialDays,
      availabilityRule?.quickSlotsReleaseWindowMins,
      availabilityRule._id.toString()
    );
  }

  protected toPersistence(
    entity: Partial<AvailabilityRule>
  ): Partial<IAvailabilityRuleDocument> {
    return {
      psychologist: new Types.ObjectId(entity.psychologist),
      startTime: entity.startTime,
      endTime: entity.endTime,
      startDate: entity.startDate,
      endDate: entity.endDate,
      durationInMins: entity.durationInMins,
      bufferTimeInMins: entity.bufferTimeInMins,
      quickSlots: entity.quickSlots,
      slotsOpenTime: entity.slotsOpenTime,
      specialDays: entity.specialDays,
      quickSlotsReleaseWindowMins: entity.quickSlotsReleaseWindowMins,
      _id: entity.id ? new Types.ObjectId(entity.id) : undefined,
    };
  }

  async findAllByPsychId(psychId: string): Promise<AvailabilityRule[]> {
    const availabilityRules = await this.model.find({ psychologist: psychId });
    return availabilityRules.map((rule) => this.toDomain(rule));
  }

  async findByTimePeriod(
    fromDate: Date,
    toDate: Date
  ): Promise<AvailabilityRule[]> {
    const availabilityRules = await this.model.find({
      $or: [
        {
          $and: [
            { startDate: { $gte: fromDate } },
            { startDate: { $lte: toDate } },
          ],
        },
        {
          $and: [
            { endDate: { $gte: fromDate } },
            { endDate: { $lte: toDate } },
          ],
        },
      ],
    });
    return availabilityRules.map((rule) => this.toDomain(rule));
  }

  async findByDate(date: Date): Promise<AvailabilityRule | null> {
    const availabilityRule = await this.model.findOne({
      $and: [{ startDate: { $lte: date } }, { endDate: { $gte: date } }],
    });
    if (!availabilityRule) {
      return null;
    }
    return this.toDomain(availabilityRule);
  }
}
