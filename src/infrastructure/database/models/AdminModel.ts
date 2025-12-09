import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAdmin {
  email: string;
  password: string;
}

export interface IAdminDocument extends Document<Types.ObjectId, {}, IAdmin>, IAdmin {}

const AdminSchema = new Schema<IAdminDocument>({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

export const AdminModel = mongoose.model<IAdminDocument>("Admin", AdminSchema);
