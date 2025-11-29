import { model, Schema, Document} from "mongoose";
import { NotificationRecipientType } from "../../../domain/enums/NotificationRecipientType.js";

export interface INotificationDocument extends Document {
  recipientId: string;
  recipientType:NotificationRecipientType,
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
