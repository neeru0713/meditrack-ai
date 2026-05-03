import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Medication } from '@/lib/models/Medication';
import { withOwnedRecord } from '@/lib/crud-helpers';

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  dosage: z.string().min(1).optional(),
  schedule: z.string().min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional().nullable()
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ownership = await withOwnedRecord(id, (recordId) => Medication.findById(recordId));
  if ('error' in ownership) return ownership.error;

  const payload = patchSchema.parse(await req.json());
  const updated = await Medication.findByIdAndUpdate(
    id,
    {
      ...payload,
      startDate: payload.startDate ? new Date(payload.startDate) : undefined,
      endDate: payload.endDate ? new Date(payload.endDate) : payload.endDate === null ? null : undefined
    },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ownership = await withOwnedRecord(id, (recordId) => Medication.findById(recordId));
  if ('error' in ownership) return ownership.error;

  await Medication.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
