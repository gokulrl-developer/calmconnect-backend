import { model, Schema, Document, Types } from "mongoose";

export interface IComplaintDocument extends Document {
  user: Types.ObjectId;
  psychologist: Types.ObjectId;
  session?: Types.ObjectId;
  description: string;
  status: "resolved" | "pending";
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
    status: { type: String, enum: ["resolved", "pending"], default: "pending" },
    adminNotes: { type: String },
    resolvedAt: { type: Date },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ComplaintModel = model<IComplaintDocument>("Complaint", ComplaintSchema);
