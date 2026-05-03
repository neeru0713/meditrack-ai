import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Symptom } from '@/lib/models/Symptom';
import { withOwnedRecord } from '@/lib/crud-helpers';

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  severity: z.enum(['mild', 'moderate', 'severe']).optional(),
  description: z.string().optional(),
  recordedAt: z.string().datetime().optional()
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const ownership = await withOwnedRecord(id, (recordId) => Symptom.findById(recordId));
  if ('error' in ownership) return ownership.error;

  const payload = patchSchema.parse(await req.json());
  const updated = await Symptom.findByIdAndUpdate(
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
  const ownership = await withOwnedRecord(id, (recordId) => Symptom.findById(recordId));
  if ('error' in ownership) return ownership.error;

  await Symptom.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
