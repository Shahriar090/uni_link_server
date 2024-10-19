import mongoose, { model, Schema } from 'mongoose';
import { TUser } from './user.interface';

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'Faculty', 'Student'],
    },
    status: {
      type: String,
      enum: ['In-Progress', 'Blocked'],
      default: 'In-Progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// user model

export const User = model<TUser>('User', userSchema);
