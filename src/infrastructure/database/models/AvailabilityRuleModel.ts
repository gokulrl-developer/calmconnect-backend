import { model, Schema,Document, Types} from "mongoose";

export interface IAvailabilityRuleDocument extends Document{
   psychologist:Types.ObjectId,
   startTime:string,
   endTime:string,
   startDate:Date,
   endDate:Date,
   durationInMins:number,
   bufferTimeInMins:number,
   quickSlots:string[],
   slotsOpenTime:Date,
   specialDays: {
       weekDay:number,
       availableSlots:string[]
    }[]
    ,
   quickSlotsReleaseWindowMins:number,
   id:string

}

const AvailabilityRuleSchema=new Schema<IAvailabilityRuleDocument>(
    {
   psychologist:{type:Schema.Types.ObjectId,required:true},
   startTime:{type:String,required:true},
   endTime:{type:String,required:true},
   startDate:{type:Date,required:true},
   endDate:{type:Date,required:true},
   durationInMins:{type:Number,required:true},
   bufferTimeInMins:{type:Number,required:true},
   quickSlots:[{type:String}],
   slotsOpenTime:{type:Date,required:true},
   quickSlotsReleaseWindowMins:{type:Number,required:true},
   specialDays:[
    {
        weekDay:{type:Number},
        availableSlots:[{type:String}]
    }
   ],
    }
);

export const AvailabilityRuleModel=model<IAvailabilityRuleDocument>("AvailabilityRule",AvailabilityRuleSchema)