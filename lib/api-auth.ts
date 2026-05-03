import { Types } from 'mongoose';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';

export type SessionUser = {
  id: string;
  role: 'user' | 'doctor';
};

export async function requireSessionUser(): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('UNAUTHORIZED');
  }

  return {
    id: session.user.id,
    role: (session.user.role as 'user' | 'doctor') || 'user'
  };
}

export async function canAccessUserRecords(actor: SessionUser, targetUserId: string) {
  if (!Types.ObjectId.isValid(targetUserId)) return false;
  if (actor.role === 'user') return actor.id === targetUserId;

  await connectDB();
  const doctor = await User.findById(actor.id).select('assignedPatients').lean();
  if (!doctor) return false;

  const assigned = (doctor.assignedPatients || []).map((id) => String(id));
  return actor.id === targetUserId || assigned.includes(targetUserId);
}

export async function resolveTargetUserId(searchParams: URLSearchParams) {
  const actor = await requireSessionUser();
  const requestedUserId = searchParams.get('userId') || actor.id;
  const allowed = await canAccessUserRecords(actor, requestedUserId);

  if (!allowed) {
    throw new Error('FORBIDDEN');
  }

  return { actor, targetUserId: requestedUserId };
}
