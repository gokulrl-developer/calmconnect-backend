import { model, Schema,Document,Types } from "mongoose";

export interface IHolidayDocument extends Document{
   psychologist:Types.ObjectId,
   date:Date,
   availableSlots:String[]
}

const HolidaySchema=new Schema<IHolidayDocument>(
    {
   psychologist:{type:Schema.Types.ObjectId,required:true},
   date:{type:Date,required:true},
   availableSlots:[{type:String}]
    }
)

export const HolidayModel=model<IHolidayDocument>("Holiday",HolidaySchema)