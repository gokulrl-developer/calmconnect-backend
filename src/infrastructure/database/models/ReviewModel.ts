import { model, Schema, Document, Types } from "mongoose";

export interface IReviewDocument extends Document {
  sessionId: Types.ObjectId;
  user: Types.ObjectId;
  psychologist: Types.ObjectId;
  rating: number; // 1–5
  comment?: string;
  createdAt: Date;
  id: string;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    psychologist: { type: Schema.Types.ObjectId, ref: "Psychologist", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 300 },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ReviewModel = model<IReviewDocument>("Review", ReviewSchema);
