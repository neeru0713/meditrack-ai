import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { User, IUser } from '@/lib/models/User';
import { requireSessionUser } from '@/lib/api-auth';

const schema = z.object({
  patientId: z.string().min(1)
});

export async function POST(req: Request) {
  try {
    const actor = await requireSessionUser();
    if (actor.role !== 'doctor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = schema.parse(await req.json());
    if (!Types.ObjectId.isValid(body.patientId)) {
      return NextResponse.json({ error: 'Invalid patientId' }, { status: 400 });
    }

    await connectDB();

    const patient = await User.findById(body.patientId).lean<IUser | null>();
    if (!patient || patient.role !== 'user') {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    await User.findByIdAndUpdate(actor.id, { $addToSet: { assignedPatients: body.patientId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
