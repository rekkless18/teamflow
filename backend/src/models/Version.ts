export interface Version {
  id?: number;
  name: string;
  priority: number;
  summary: string;
  start_date: Date;
  end_date: Date;
  status: 'planning' | 'development' | 'testing' | 'release' | 'completed';
  progress: number;
  created_at?: Date;
  updated_at?: Date;
}

export enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
} 