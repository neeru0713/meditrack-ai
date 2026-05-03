import { Schema, model, models } from 'mongoose';

export interface IMedication {
  userId: Schema.Types.ObjectId;
  name: string;
  dosage: string;
  schedule: string;
  startDate: Date;
  endDate?: Date;
}

const medicationSchema = new Schema<IMedication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    schedule: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date
  },
  { timestamps: true }
);

medicationSchema.index({ userId: 1, createdAt: -1 });

export const Medication = models.Medication || model<IMedication>('Medication', medicationSchema);
