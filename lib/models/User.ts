import { Schema, model, models } from 'mongoose';

export type Role = 'user' | 'doctor';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: Role;
  assignedPatients: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    role: { type: String, enum: ['user', 'doctor'], default: 'user' },
    assignedPatients: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>('User', userSchema);
