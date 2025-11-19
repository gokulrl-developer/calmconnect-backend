import { Types } from "mongoose";
import AvailabilityRule from "../../../domain/entities/availability-rule.entity.js";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository.js";
import { AvailabilityRuleModel, IAvailabilityRuleDocument } from "../models/AvailabilityRuleModel.js";
import { BaseRepository } from "./BaseRepository.js";


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
      availabilityRule.psychologist.toString(),
      availabilityRule.weekDay,
      availabilityRule.startTime,
      availabilityRule.endTime,
      availabilityRule.durationInMins,
      availabilityRule.bufferTimeInMins ?? 0,
      availabilityRule.status,
      availabilityRule._id.toString()
    );
  }

  
  protected toPersistence(entity: Partial<AvailabilityRule>): Partial<IAvailabilityRuleDocument> {
    const persistenceObj: Partial<IAvailabilityRuleDocument> = {};
    if (entity.psychologist) persistenceObj.psychologist = new Types.ObjectId(entity.psychologist);
    if (entity.weekDay !== undefined) persistenceObj.weekDay = entity.weekDay;
    if (entity.startTime !== undefined) persistenceObj.startTime = entity.startTime;
    if (entity.endTime !== undefined) persistenceObj.endTime = entity.endTime;
    if (entity.durationInMins !== undefined) persistenceObj.durationInMins = entity.durationInMins;
    if (entity.bufferTimeInMins !== undefined) persistenceObj.bufferTimeInMins = entity.bufferTimeInMins;
    if (entity.status !== undefined) persistenceObj.status = entity.status;
    if (entity.id) persistenceObj._id = new Types.ObjectId(entity.id);
    return persistenceObj;
  }

  async findAllActiveByPsychId(psychId: string): Promise<AvailabilityRule[]> {
    const rules = await this.model.find({ psychologist: psychId,status:"active" });
    return rules.map((rule) => this.toDomain(rule));
  }

  async findActiveByWeekDayPsych(weekDay: number, psychId: string): Promise<AvailabilityRule[]> {
    const docs = await this.model.find({ psychologist: psychId, weekDay,status:"active" });
   
    return docs.map((doc)=>this.toDomain(doc));
  }
}
