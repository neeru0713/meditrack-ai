import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { canAccessUserRecords, requireSessionUser } from '@/lib/api-auth';

export async function withOwnedRecord<T extends { userId: unknown }>(
  id: string,
  finder: (id: string) => Promise<T | null>
) {
  const actor = await requireSessionUser();
  await connectDB();

  const record = await finder(id);
  if (!record) {
    return { error: NextResponse.json({ error: 'Not found' }, { status: 404 }) };
  }

  const targetUserId = String(record.userId);
  const allowed = await canAccessUserRecords(actor, targetUserId);
  if (!allowed) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { actor, record };
}
