import { Schema, model, Document, Types } from "mongoose";

export interface IApplicationDocument extends Document {
  psychologist: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  submittedAt: Date;
  phone: string;
  gender: "male" | "female" | "others";
  dob: Date;
  profilePicture: string;
  address: string;
  walletBalance: number;
  languages: string;
  specializations: string[];
  bio: string;
  licenseUrl: string;
  resume:string,
  qualifications: string;
  hourlyFees?: number;
  status: "pending" | "accepted" | "rejected";
  rejectionReason?: string;
  avgRating?: number;
  createdAt?: Date;
}

const ApplicationSchema = new Schema<IApplicationDocument>(
  {
    psychologist: { type: Schema.Types.ObjectId, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
    phone: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "others"], required: true },
    dob: { type: Date, required: true },
    profilePicture: { type: String },
    address: { type: String },
    walletBalance: { type: Number, default: 0 },
    languages: { type: String },
    specializations: { type: [String] },
    bio: { type: String },
    licenseUrl: { type: String },
    resume: { type: String },
    qualifications: { type: String },
    hourlyFees: { type: Number },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    rejectionReason: { type: String},
    avgRating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  }
);

export const ApplicationModel = model<IApplicationDocument>("Application", ApplicationSchema);
