import axios from 'axios';
import { format } from 'date-fns';

const API_URL = 'http://localhost:3001/api';

export interface Version {
  id?: number;
  name: string;
  priority: number;
  summary: string;
  start_date: Date | string;
  end_date: Date | string;
  status: 'planning' | 'development' | 'testing' | 'release' | 'completed';
  progress: number;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

// 将日期对象格式化为YYYY-MM-DD字符串
const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') return date;
  return format(date, 'yyyy-MM-dd');
};

// 创建API实例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 获取所有版本
export const getAllVersions = async (): Promise<Version[]> => {
  const response = await api.get('/versions');
  return response.data;
};

// 获取单个版本
export const getVersionById = async (id: number): Promise<Version> => {
  const response = await api.get(`/versions/${id}`);
  return response.data;
};

// 创建新版本
export const createVersion = async (version: Version): Promise<Version> => {
  // 确保日期是字符串格式
  const formattedVersion = {
    ...version,
    start_date: formatDate(version.start_date),
    end_date: formatDate(version.end_date),
  };
  
  const response = await api.post('/versions', formattedVersion);
  return response.data;
};

// 更新版本
export const updateVersion = async (id: number, version: Version): Promise<Version> => {
  // 确保日期是字符串格式
  const formattedVersion = {
    ...version,
    start_date: formatDate(version.start_date),
    end_date: formatDate(version.end_date),
  };
  
  const response = await api.put(`/versions/${id}`, formattedVersion);
  return response.data;
};

// 删除版本
export const deleteVersion = async (id: number): Promise<void> => {
  await api.delete(`/versions/${id}`);
}; 