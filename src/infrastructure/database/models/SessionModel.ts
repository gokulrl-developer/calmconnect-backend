import { model, Schema, Document, Types } from "mongoose";

export interface ISessionDocument extends Document {
  psychologist: Types.ObjectId;
  user: Types.ObjectId;
  startTime: Date;
  endTime:Date,
  durationInMins: number;
  transactionIds: Types.ObjectId[];
  status: "scheduled" | "completed" | "cancelled" |"available" | "pending";
  fees: number; 
  videoRoomId?: string;
  progressNotesId?: string;
}

const SessionSchema = new Schema<ISessionDocument>({
  psychologist: { type: Schema.Types.ObjectId, required: true, ref: "Psychologist" },
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  durationInMins: { type: Number, required: true },
  transactionIds: [{ type: String, required: true }],
  status: { type: String, enum: ["scheduled", "completed", "cancelled","available","pending"], required: true },
  fees: { type: Number, required: true },
  videoRoomId: { type: String },
  progressNotesId: { type: String },
});

export const SessionModel = model<ISessionDocument>("Session", SessionSchema);
