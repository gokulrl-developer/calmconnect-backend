import { Types } from "mongoose";
import Holiday from "../../../domain/entities/holiday.entity";
import IHolidayRepository from "../../../domain/interfaces/IHolidayRepository";
import { HolidayModel, IHolidayDocument } from "../models/HolidayModel";
import { BaseRepository } from "./BaseRepository";

export default class HolidayRepository extends BaseRepository<Holiday,IHolidayDocument>
implements IHolidayRepository{
    constructor(

    ){
        super(HolidayModel)
    }
    protected toDomain(doc:IHolidayDocument):Holiday{
        const holiday=doc.toObject();
      return new Holiday(
        holiday.psychologist.toString(),
       holiday.date,
       holiday.availableSlots,
       holiday._id.toString()
      )      
    }

    protected toPersistence(entity:Partial<Holiday>):Partial<IHolidayDocument>{
        return {
            psychologist:new Types.ObjectId(entity.psychologist),
            date:new Date(entity.date!),
            availableSlots:entity.availableSlots,
            _id:entity.id?new Types.ObjectId(entity.id):undefined
        }
    }

    async updateDailySlots(holiday: Holiday): Promise<Holiday> {
        const updatedHoliday=await this.model.findOneAndUpdate({date:holiday.date,psychologist:holiday.psychologist},
                                            {$set:{...this.toPersistence(holiday)}},
                                            {new:true,upsert:true});
        return this.toDomain(updatedHoliday)
    }

    async findByDatePsych(date:Date,psychId:string):Promise<Holiday | null>{
        const holiday=await this.model.findOne({psychologist:new Types.ObjectId(psychId),date:date});
        if(holiday===null){
            return null
        }
        return this.toDomain(holiday)
    }

}