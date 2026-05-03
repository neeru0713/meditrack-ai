import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'doctor']).default('user')
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    await connectDB();

    const exists = await User.findOne({ email: body.email.toLowerCase() }).lean();
    if (exists) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(body.password, 12);
    const user = await User.create({
      name: body.name,
      email: body.email.toLowerCase(),
      password: hashed,
      role: body.role,
      assignedPatients: []
    });

    return NextResponse.json({ id: String(user._id), email: user.email, role: user.role }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
