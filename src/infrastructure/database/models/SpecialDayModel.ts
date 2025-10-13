import { model, Schema, Document, Types } from "mongoose";

export interface ISpecialDayDocument extends Document {
  psychologist: Types.ObjectId;
  date: Date;
  type: "override" | "absent";
  startTime?: Date;
  endTime?: Date;
  durationInMins?: number;
  bufferTimeInMins?: number;
  status: "active" | "inactive";
  id: string;
}

const SpecialDaySchema = new Schema<ISpecialDayDocument>(
  {
    psychologist: { type: Schema.Types.ObjectId, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ["override", "absent"], required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    durationInMins: { type: Number },
    bufferTimeInMins: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true, 
  }
);

export const SpecialDayModel = model<ISpecialDayDocument>(
  "SpecialDay",
  SpecialDaySchema
);
