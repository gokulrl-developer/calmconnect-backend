import { Types } from "mongoose";
import SpecialDay from "../../../domain/entities/special-day.entity.js";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository.js";
import { SpecialDayModel, ISpecialDayDocument } from "../models/SpecialDayModel.js";
import { BaseRepository } from "./BaseRepository.js";
import { SpecialDayStatus } from "../../../domain/enums/SpecialDayStatus.js";

export default class SpecialDayRepository
  extends BaseRepository<SpecialDay, ISpecialDayDocument>
  implements ISpecialDayRepository
{
  constructor() {
    super(SpecialDayModel);
  }

  protected toDomain(doc: ISpecialDayDocument): SpecialDay {
    const specialDay = doc.toObject();
    return new SpecialDay(
      specialDay.psychologist.toString(),
      specialDay.date,
      specialDay.type,
      specialDay.startTime,
      specialDay.endTime,
      specialDay.durationInMins,
      specialDay.bufferTimeInMins,
      specialDay.status ?? SpecialDayStatus.ACTIVE,
      specialDay._id.toString()
    );
  }

  
  protected toPersistence(entity: Partial<SpecialDay>): Partial<ISpecialDayDocument> {
    const persistenceObj: Partial<ISpecialDayDocument> = {};

    if (entity.psychologist) persistenceObj.psychologist = new Types.ObjectId(entity.psychologist);
    if (entity.date) persistenceObj.date = entity.date;
    if (entity.type) persistenceObj.type = entity.type;
    if (entity.startTime !== undefined) persistenceObj.startTime = entity.startTime;
    if (entity.endTime !== undefined) persistenceObj.endTime = entity.endTime;
    if (entity.durationInMins !== undefined) persistenceObj.durationInMins = entity.durationInMins;
    if (entity.bufferTimeInMins !== undefined) persistenceObj.bufferTimeInMins = entity.bufferTimeInMins;
    if (entity.status !== undefined) persistenceObj.status = entity.status;
    if (entity.id) persistenceObj._id = new Types.ObjectId(entity.id);

    return persistenceObj;
  }

  async findActiveByDatePsych(date: Date, psychId: string) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const specialDay = await this.model.findOne({
    psychologist: new Types.ObjectId(psychId),
    status: SpecialDayStatus.ACTIVE,
    date: {
      $gte: start,
      $lte: end
    }
  });

  return specialDay ? this.toDomain(specialDay) : null;
}

  async findOverlappingActiveByTimeRangePsych(
    startTime: Date,
    endTime: Date,
    psychId: string
  ): Promise<SpecialDay | null> {
    const overlapping = await this.model.findOne({
      psychologist: new Types.ObjectId(psychId),
      status:SpecialDayStatus.ACTIVE,
      $nor: [
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $lte: startTime } },
          ],
        },
        {
          $and: [
            { startTime: { $gte: endTime } },
            { endTime: { $gte: endTime } },
          ],
        },
      ],
      });

    return overlapping ? this.toDomain(overlapping) : null;
  }
}
