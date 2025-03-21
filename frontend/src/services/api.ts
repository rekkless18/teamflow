import axios from 'axios';
import { format, parseISO } from 'date-fns';

// 定义 Priority 枚举类型
export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

// 更新 Version 接口以包含缺失的属性
export interface Version {
    id: number;
    name: string;
    priority: Priority;
    summary: string;
    start_date: Date | string | undefined;
    end_date: Date | string | undefined;
    status: string;
    progress: number;
    requirement_complete_date: Date | string | undefined;
    development_complete_date: Date | string | undefined;
    testing_complete_date: Date | string | undefined;
}

const api = axios.create({
    baseURL: 'http://localhost:3001/api', // 根据实际情况修改
});

const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    if (typeof date === 'string') {
        return format(parseISO(date), 'yyyy-MM-dd');
    }
    return format(date, 'yyyy-MM-dd');
};

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
        requirement_complete_date: formatDate(version.requirement_complete_date),
        development_complete_date: formatDate(version.development_complete_date),
        testing_complete_date: formatDate(version.testing_complete_date),
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
        requirement_complete_date: formatDate(version.requirement_complete_date),
        development_complete_date: formatDate(version.development_complete_date),
        testing_complete_date: formatDate(version.testing_complete_date),
    };

    const response = await api.put(`/versions/${id}`, formattedVersion);
    return response.data;
};

// 删除版本
export const deleteVersion = async (id: number): Promise<void> => {
    await api.delete(`/versions/${id}`);
};
    