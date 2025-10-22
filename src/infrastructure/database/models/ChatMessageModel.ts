import { model, Schema, Document, Types } from "mongoose";

export interface IChatMessageDocument extends Document {
  sessionId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderName:string;
  text: string;
  createdAt: Date;
}

const ChatSchema = new Schema<IChatMessageDocument>({
  sessionId: { type: Schema.Types.ObjectId, required: true, index: true },
  senderId: { type: Schema.Types.ObjectId, required: true },
  senderName:{type:String,required:true},
  text: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

export const ChatModel = model<IChatMessageDocument>("ChatMessage", ChatSchema);
