import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Vital } from '@/lib/models/Vital';
import { resolveTargetUserId } from '@/lib/api-auth';

const schema = z.object({
  type: z.enum(['bloodPressure', 'glucose', 'weight']),
  value: z.string().min(1),
  recordedAt: z.string().datetime(),
  notes: z.string().optional()
});

export async function GET(req: Request) {
  try {
    const { targetUserId } = await resolveTargetUserId(new URL(req.url).searchParams);
    await connectDB();
  const vitals = await Vital.find({ userId: targetUserId }).sort({ recordedAt: -1 }).lean<import('@/lib/models/Vital').IVital[]>();
    return NextResponse.json(vitals);
  } catch (error) {
    const status = String(error).includes('FORBIDDEN') ? 403 : 401;
    return NextResponse.json({ error: 'Unauthorized' }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const { targetUserId } = await resolveTargetUserId(new URL(req.url).searchParams);
    const body = schema.parse(await req.json());
    await connectDB();
    const record = await Vital.create({ ...body, userId: targetUserId, recordedAt: new Date(body.recordedAt) });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    const status = String(error).includes('FORBIDDEN') ? 403 : 400;
    return NextResponse.json({ error: String(error) }, { status });
  }
}
