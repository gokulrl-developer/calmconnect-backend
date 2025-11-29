import { model, Schema, Document, Types } from "mongoose";
import { SpecialDayType } from "../../../domain/enums/SpecialDayType.js";
import { SpecialDayStatus } from "../../../domain/enums/SpecialDayStatus.js";

export interface ISpecialDayDocument extends Document {
  psychologist: Types.ObjectId;
  date: Date;
  type: SpecialDayType;
  startTime?: Date;
  endTime?: Date;
  durationInMins?: number;
  bufferTimeInMins?: number;
  status: SpecialDayStatus;
  id: string;
}

const SpecialDaySchema = new Schema<ISpecialDayDocument>(
  {
    psychologist: { type: Schema.Types.ObjectId, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: Object.values(SpecialDayType), required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    durationInMins: { type: Number },
    bufferTimeInMins: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(SpecialDayStatus), default: SpecialDayStatus.ACTIVE },
  },
  {
    timestamps: true, 
  }
);

export const SpecialDayModel = model<ISpecialDayDocument>(
  "SpecialDay",
  SpecialDaySchema
);
