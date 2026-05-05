import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Appointment } from '@/lib/models/Appointment';
import { resolveTargetUserId } from '@/lib/api-auth';

const schema = z.object({
  doctorName: z.string().min(1),
  speciality: z.string().optional(),
  location: z.string().optional(),
  scheduledAt: z.string().datetime(),
  notes: z.string().optional()
});

export async function GET(req: Request) {
  try {
    const { targetUserId } = await resolveTargetUserId(new URL(req.url).searchParams);
    await connectDB();
  const records = await Appointment.find({ userId: targetUserId }).sort({ scheduledAt: -1 }).lean<import('@/lib/models/Appointment').IAppointment[]>();
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
    const record = await Appointment.create({ ...body, userId: targetUserId, scheduledAt: new Date(body.scheduledAt) });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    const status = String(error).includes('FORBIDDEN') ? 403 : 400;
    return NextResponse.json({ error: String(error) }, { status });
  }
}
