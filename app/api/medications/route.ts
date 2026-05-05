import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Medication } from '@/lib/models/Medication';
import { resolveTargetUserId } from '@/lib/api-auth';

const schema = z.object({
  name: z.string().min(1),
  dosage: z.string().min(1),
  schedule: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional()
});

export async function GET(req: Request) {
  try {
    const { targetUserId } = await resolveTargetUserId(new URL(req.url).searchParams);
    await connectDB();
  const records = await Medication.find({ userId: targetUserId }).sort({ createdAt: -1 }).lean<import('@/lib/models/Medication').IMedication[]>();
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
    const record = await Medication.create({
      ...body,
      userId: targetUserId,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    const status = String(error).includes('FORBIDDEN') ? 403 : 400;
    return NextResponse.json({ error: String(error) }, { status });
  }
}
