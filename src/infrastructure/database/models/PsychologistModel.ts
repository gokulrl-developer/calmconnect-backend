import { Schema, model, Document, Types } from "mongoose";

export interface IPsychDocument extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  isVerified: boolean;
  isBlocked: boolean;
  dob?: Date;
  gender?: "male" | "female" | "others";
  profilePicture?: string;
  address?: string;
  walletBalance: number;
  languages?: string;
  specializations?: string[];
  bio?: string;
  avgRating?: number;
  hourlyFees?: number;
  applications?: string[];
  licenseUrl?: string;
  qualifications?: string;
  createdAt?: Date;
  updatedAt?: Date;
  googleId?: string;
  isGooglePsych?: boolean;
}

const PsychologistSchema = new Schema<IPsychDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "others"] },
    profilePicture: { type: String },
    address: { type: String },
    walletBalance: { type: Number, default: 0 },
    languages: { type: String },
    specializations: [{ type: String }],
    bio: { type: String },
    avgRating: { type: Number },
    hourlyFees: { type: Number },
    applications: [{ type: String }],
    licenseUrl: { type: String },
    qualifications: { type: String },
    googleId: { type: String },
    isGooglePsych: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const PsychModel = model<IPsychDocument>(
  "Psychologist",
  PsychologistSchema
);
