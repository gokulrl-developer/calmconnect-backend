import { model, Schema, Document, Types } from "mongoose";
import { QuickSlotStatus } from "../../../domain/enums/QuickSlotStatus.js";


export interface IQuickSlotDocument extends Document {
  psychologist: Types.ObjectId;
  date: Date;
  startTime: Date;
  endTime: Date;
  durationInMins: number;
  bufferTimeInMins: number;
  status: QuickSlotStatus;
  id: string;
}

const QuickSlotSchema = new Schema<IQuickSlotDocument>(
  {
    psychologist: { type: Schema.Types.ObjectId, required: true },
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    durationInMins: { type: Number, required: true },
    bufferTimeInMins: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(QuickSlotStatus), default: QuickSlotStatus.ACTIVE },
  },
  {
    timestamps: true, 
  }
);

export const QuickSlotModel = model<IQuickSlotDocument>(
  "QuickSlot",
  QuickSlotSchema
);
