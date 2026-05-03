import { Schema, model, models } from 'mongoose';

export interface IVital {
  userId: Schema.Types.ObjectId;
  type: 'bloodPressure' | 'glucose' | 'weight';
  value: string;
  recordedAt: Date;
  notes?: string;
}

const vitalSchema = new Schema<IVital>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['bloodPressure', 'glucose', 'weight'], required: true },
    value: { type: String, required: true },
    recordedAt: { type: Date, required: true },
    notes: String
  },
  { timestamps: true }
);

vitalSchema.index({ userId: 1, recordedAt: -1 });

export const Vital = models.Vital || model<IVital>('Vital', vitalSchema);
