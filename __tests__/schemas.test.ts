import { describe, expect, it } from 'vitest';
import { z } from 'zod';

const vitalSchema = z.object({
  type: z.enum(['bloodPressure', 'glucose', 'weight']),
  value: z.string().min(1),
  recordedAt: z.string().datetime()
});

describe('vital schema', () => {
  it('accepts valid payload', () => {
    const parsed = vitalSchema.safeParse({
      type: 'weight',
      value: '72',
      recordedAt: new Date().toISOString()
    });

    expect(parsed.success).toBe(true);
  });

  it('rejects invalid payload', () => {
    const parsed = vitalSchema.safeParse({
      type: 'pulse',
      value: '',
      recordedAt: 'yesterday'
    });

    expect(parsed.success).toBe(false);
  });
});
