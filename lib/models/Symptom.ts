import { Schema, model, models } from 'mongoose';

export interface ISymptom {
  userId: Schema.Types.ObjectId;
  title: string;
  severity: 'mild' | 'moderate' | 'severe';
  description?: string;
  recordedAt: Date;
}

const symptomSchema = new Schema<ISymptom>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    severity: { type: String, enum: ['mild', 'moderate', 'severe'], required: true },
    description: String,
    recordedAt: { type: Date, required: true }
  },
  { timestamps: true }
);

symptomSchema.index({ userId: 1, recordedAt: -1 });

export const Symptom = models.Symptom || model<ISymptom>('Symptom', symptomSchema);
