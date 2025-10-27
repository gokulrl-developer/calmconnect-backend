import { model, Schema, Document, Types } from "mongoose";

export interface INotificationDocument extends Document {
  recipientId: string;
  recipientType:"user"|"psychologist"|"admin",
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    recipientId: { type: String, required: true, index: true },
    recipientType: { type: String, required: true},
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const NotificationModel =
  model<INotificationDocument>("Notification", NotificationSchema);
