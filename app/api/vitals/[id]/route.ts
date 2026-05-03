import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Vital } from '@/lib/models/Vital';
import { withOwnedRecord } from '@/lib/crud-helpers';

const patchSchema = z.object({
  type: z.enum(['bloodPressure', 'glucose', 'weight']).optional(),
  value: z.string().min(1).optional(),
  recordedAt: z.string().datetime().optional(),
  notes: z.string().optional()
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const ownership = await withOwnedRecord(id, (recordId) => Vital.findById(recordId));
  if ('error' in ownership) return ownership.error;

  const payload = patchSchema.parse(await req.json());
  if (payload.recordedAt) payload.recordedAt = new Date(payload.recordedAt).toISOString();

  const updated = await Vital.findByIdAndUpdate(
    id,
    {
      ...payload,
      recordedAt: payload.recordedAt ? new Date(payload.recordedAt) : undefined
    },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const ownership = await withOwnedRecord(id, (recordId) => Vital.findById(recordId));
  if ('error' in ownership) return ownership.error;

  await Vital.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
