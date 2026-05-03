import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Symptom } from '@/lib/models/Symptom';
import { resolveTargetUserId } from '@/lib/api-auth';

const schema = z.object({
  title: z.string().min(1),
  severity: z.enum(['mild', 'moderate', 'severe']),
  description: z.string().optional(),
  recordedAt: z.string().datetime()
});

export async function GET(req: Request) {
  try {
    const { targetUserId } = await resolveTargetUserId(new URL(req.url).searchParams);
    await connectDB();
    const records = await Symptom.find({ userId: targetUserId }).sort({ recordedAt: -1 }).lean();
    return NextResponse.json(records);
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
    const record = await Symptom.create({ ...body, userId: targetUserId, recordedAt: new Date(body.recordedAt) });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    const status = String(error).includes('FORBIDDEN') ? 403 : 400;
    return NextResponse.json({ error: String(error) }, { status });
  }
}
