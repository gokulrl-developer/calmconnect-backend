import { model, Schema, Document, Types } from "mongoose";

export default class QuickSlot {
  constructor(
    public psychologist: string,
    public date: Date,
    public startTime: Date, 
    public endTime: Date, 
    public durationInMins: number, // slot duration
    public bufferTimeInMins: number, // optional buffer
    public status: "active" | "inactive" = "active",
    public id?: string
  ) {}
}

export interface IQuickSlotDocument extends Document {
  psychologist: Types.ObjectId;
  date: Date;
  startTime: Date;
  endTime: Date;
  durationInMins: number;
  bufferTimeInMins: number;
  status: "active" | "inactive";
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
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true, 
  }
);

export const QuickSlotModel = model<IQuickSlotDocument>(
  "QuickSlot",
  QuickSlotSchema
);
