import mongoose, { Schema, Document } from "mongoose";


export interface IAdminDocument extends Document{
 email: string;
  password: string;
}

const AdminSchema = new Schema<IAdminDocument>({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

export const AdminModel = mongoose.model<IAdminDocument>("Admin", AdminSchema);
