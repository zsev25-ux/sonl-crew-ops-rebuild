import { db } from '../shared/lib/dexie';
import { Job, JobSchema } from './job.schema';

export const getJobById = (id: string): Promise<Job | undefined> => {
  return db.jobs.get(id);
};

export const getAllJobs = (): Promise<Job[]> => {
  return db.jobs.toArray();
};

export const upsertJob = (job: Job): Promise<string> => {
  // Validate the job object against the schema before saving
  // This ensures no invalid data enters our local DB
  const validatedJob = JobSchema.parse(job);
  return db.jobs.put(validatedJob);
};

export const deleteJob = (id: string): Promise<void> => {
  return db.jobs.delete(id);
};
