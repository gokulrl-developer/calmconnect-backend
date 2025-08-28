import { Schema, model, Document } from 'mongoose';

export interface IUserDocument extends Document {
  firstName: string;                        
  lastName: string;
  email: string;                                    
  password?: string;
  isVerified: boolean;
  isBlocked: boolean;
  dob?: Date;
  gender?: 'male' | 'female' | 'others';
  profilePicture?: string;
  address?: string;
  walletBalance: number;
  googleId?: string;
  isGoogleUser?: boolean;
  createdAt?:Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isBlocked: { type: Boolean, default: false },
    dob: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'others'] },
    profilePicture: { type: String },
    address: { type: String },
    walletBalance: { type: Number, default: 0 },
    googleId: { type: String },
    isGoogleUser: { type: Boolean, default: false },
    createdAt:  {type:Boolean,default:Date.now()}
  },
);

export const UserModel = model<IUserDocument>('User', UserSchema);
