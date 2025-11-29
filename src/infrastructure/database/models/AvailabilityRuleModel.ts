import { model, Schema, Document, Types } from "mongoose";
import { AvailabilityRuleStatus } from "../../../domain/enums/AvailabilityRuleStatus.js";

export interface IAvailabilityRuleDocument extends Document {
  psychologist: Types.ObjectId;
  weekDay: number;             // 0-6
  startTime: string;           // "09:00"
  endTime: string;             // "17:00"
  durationInMins: number;
  bufferTimeInMins: number;
  status: AvailabilityRuleStatus;
  id: string;
}

const AvailabilityRuleSchema = new Schema<IAvailabilityRuleDocument>(
  {
    psychologist: { type: Schema.Types.ObjectId, required: true },
    weekDay: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    durationInMins: { type: Number, required: true },
    bufferTimeInMins: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(AvailabilityRuleStatus), default: AvailabilityRuleStatus.ACTIVE },
  },
  {
    timestamps: true, 
  }
);

export const AvailabilityRuleModel = model<IAvailabilityRuleDocument>(
  "AvailabilityRule",
  AvailabilityRuleSchema
);
