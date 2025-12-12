import { model, Schema, Document, Types } from "mongoose";
import { ComplaintStatus } from "../../../domain/enums/ComplaintStatus.js";

export interface IComplaintDocument extends Document {
  user: Types.ObjectId;
  psychologist: Types.ObjectId;
  session?: Types.ObjectId;
  description: string;
  status: ComplaintStatus;
  createdAt: Date;
  adminNotes?: string;
  resolvedAt?: Date;
  id: string;
}

const ComplaintSchema = new Schema<IComplaintDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    psychologist: { type: Schema.Types.ObjectId, ref: "Psychologist", required: true },
    session: { type: Schema.Types.ObjectId, ref: "Session" },
    description: { type: String, required: true },
    status: { type: String, enum: Object.values(ComplaintStatus), default: ComplaintStatus.PENDING },
    adminNotes: { type: String },
    resolvedAt: { type: Date },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ComplaintModel = model<IComplaintDocument>("Complaint", ComplaintSchema);
