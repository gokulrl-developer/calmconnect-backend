import { Types } from "mongoose";
import QuickSlot from "../../../domain/entities/quick-slot.entity.js";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository.js";
import { QuickSlotModel, IQuickSlotDocument } from "../models/QuickSlotModel.js";
import { BaseRepository } from "./BaseRepository.js";

export default class QuickSlotRepository
  extends BaseRepository<QuickSlot, IQuickSlotDocument>
  implements IQuickSlotRepository
{
  constructor() {
    super(QuickSlotModel);
  }

  protected toDomain(doc: IQuickSlotDocument): QuickSlot {
    const slot = doc.toObject();
    return new QuickSlot(
      slot.psychologist.toString(),
      slot.date,
      slot.startTime,
      slot.endTime,
      slot.durationInMins,
      slot.bufferTimeInMins ?? 0,
      slot.status ?? "active",
      slot._id.toString()
    );
  }

  
  protected toPersistence(entity: Partial<QuickSlot>): Partial<IQuickSlotDocument> {
    const persistenceObj: Partial<IQuickSlotDocument> = {};

    if (entity.psychologist) persistenceObj.psychologist = new Types.ObjectId(entity.psychologist);
    if (entity.date) persistenceObj.date = entity.date;
    if (entity.startTime !== undefined) persistenceObj.startTime = entity.startTime;
    if (entity.endTime !== undefined) persistenceObj.endTime = entity.endTime;
    if (entity.durationInMins !== undefined) persistenceObj.durationInMins = entity.durationInMins;
    if (entity.bufferTimeInMins !== undefined) persistenceObj.bufferTimeInMins = entity.bufferTimeInMins;
    if (entity.status !== undefined) persistenceObj.status = entity.status;
    if (entity.id) persistenceObj._id = new Types.ObjectId(entity.id);

    return persistenceObj;
  }

  async findActiveByDatePsych(date: Date, psychId: string): Promise<QuickSlot[]> {
    const slots = await this.model.find({ psychologist: new Types.ObjectId(psychId), date,status:"active" });
    return slots.map((slot) => this.toDomain(slot));
  }

  async findOverlappingActiveByTimeRangePsych(
    startTime: Date,
    endTime: Date,
    psychId: string
  ): Promise<QuickSlot[]> {
    const overlapping = await this.model.find({
      psychologist: new Types.ObjectId(psychId),
      status:"active",
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gt: startTime } },
          ],
        },
      ],
    });

    return overlapping.map((slot) => this.toDomain(slot));
  }

  async findActiveByWeekDayPsych(psychId: string, weekDay: number): Promise<QuickSlot[]> {
    console.log(psychId,weekDay)
    const quickSlots=await this.model.aggregate([
      {$match:{psychologist:new Types.ObjectId(psychId),status:"active"}},
      {$addFields:{weekDay:{$add:[{$dayOfWeek:{date:"$date",timezone: "Asia/Kolkata"}},-1]}}},
      {$match:{weekDay:weekDay}},
      {$project:{weekDay:0}}
     ]);
    const docs = quickSlots.map((obj) => QuickSlotModel.hydrate(obj));
    return docs.map((qs)=>this.toDomain(qs));
  }
}
