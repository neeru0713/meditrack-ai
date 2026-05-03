import { Schema, model, models } from 'mongoose';

export interface IAppointment {
  userId: Schema.Types.ObjectId;
  doctorName: string;
  speciality?: string;
  location?: string;
  scheduledAt: Date;
  notes?: string;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    doctorName: { type: String, required: true },
    speciality: String,
    location: String,
    scheduledAt: { type: Date, required: true },
    notes: String
  },
  { timestamps: true }
);

appointmentSchema.index({ userId: 1, scheduledAt: -1 });

export const Appointment = models.Appointment || model<IAppointment>('Appointment', appointmentSchema);
