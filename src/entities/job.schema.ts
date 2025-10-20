import { z } from 'zod';

export const JobCoreSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  crew: z.string().min(1, 'Crew assignment is required'),
  client: z.string().min(1, 'Client name is required').trim(),
  scope: z.string().min(1, 'Scope of work is required').trim(),
  notes: z.string().optional(),
  address: z.string().trim().optional(),
  neighborhood: z.string().trim().optional(),
  zip: z.string().trim().optional(),
  houseTier: z.number().int().min(1).max(5).optional(),
  vip: z.boolean().default(false),
});

export const JobSchema = JobCoreSchema.extend({
  id: z.string().uuid('ID must be a valid UUID'),
  meta: z.any().optional(),
  version: z.number().int().positive().default(1),
  updatedAt: z.number().positive(),
});

export type JobCore = z.infer<typeof JobCoreSchema>;
export type Job = z.infer<typeof JobSchema>;
