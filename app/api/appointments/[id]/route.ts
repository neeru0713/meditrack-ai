import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Appointment } from '@/lib/models/Appointment';
import { withOwnedRecord } from '@/lib/crud-helpers';

const patchSchema = z.object({
  doctorName: z.string().min(1).optional(),
  speciality: z.string().optional(),
  location: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  notes: z.string().optional()
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const ownership = await withOwnedRecord(id, (recordId) => Appointment.findById(recordId));
  if ('error' in ownership) return ownership.error;

  const payload = patchSchema.parse(await req.json());
  const updated = await Appointment.findByIdAndUpdate(
    id,
    {
      ...payload,
      scheduledAt: payload.scheduledAt ? new Date(payload.scheduledAt) : undefined
    },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const ownership = await withOwnedRecord(id, (recordId) => Appointment.findById(recordId));
  if ('error' in ownership) return ownership.error;

  await Appointment.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
