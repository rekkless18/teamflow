export interface Version {
  id?: number;
  name: string;
  priority: number;
  summary: string;
  start_date: Date;
  online_date: Date; // 将 end_date 改为 online_date
  requirement_complete_date?: Date; // 新增需求完成时间
  development_complete_date?: Date; // 新增开发完成时间
  testing_complete_date?: Date; // 新增测试完成时间
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