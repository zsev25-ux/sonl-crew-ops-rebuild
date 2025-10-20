import Dexie, { type Table } from 'dexie';

// --- Data Types (will be built out more) ---
// We use 'any' for now; Zod schemas will define these.
export interface Job {
  id: string; // Using string IDs (e.g., UUIDs)
  date: string;
  crew: string;
  client: string;
  updatedAt: number;
  [key: string]: any; // Allow other job properties
}

export interface Policy {
  id: 'current'; // Singleton pattern
  [key: string]: any;
}

export interface Media {
  id: string; // UUID
  jobId: string;
  status: 'local' | 'queued' | 'uploading' | 'synced' | 'error';
  blob?: Blob; // The local file, stored temporarily
  [key: string]: any;
}

export interface UserProfile {
  id: string; // Firebase UID
  role: 'admin' | 'dispatcher' | 'crew';
  [key: string]: any;
}

export interface PendingOp {
  id: string; // UUID for the operation
  type: string;
  payload: any;
  attempt: number;
  nextAt: number; // Timestamp for next retry
  lastError?: string;
}

export interface FailedOp extends PendingOp {
  failedAt: number;
}

export interface AppState {
  key: string;
  value: any;
}

// --- Dexie Database Class ---
export class AppDexie extends Dexie {
  jobs!: Table<Job, string>;
  policy!: Table<Policy, string>;
  media!: Table<Media, string>;
  users!: Table<UserProfile, string>;
  pendingOps!: Table<PendingOp, string>;
  failedOps!: Table<FailedOp, string>;
  appState!: Table<AppState, string>;

  constructor() {
    super('SONLCrewOpsDB');
    this.version(1).stores({
      jobs: '&id,date,crew',
      policy: '&id',
      media: '&id,jobId,status',
      users: '&id,role',
      pendingOps: '&id,nextAt', // Index 'nextAt' for efficient queue processing
      failedOps: '&id',
      appState: '&key',
    });
  }
}

export const db = new AppDexie();
