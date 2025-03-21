export type Priority = 'low' | 'medium' | 'high';

export interface Version {
    id: number;
    name: string;
    priority: Priority;
    // ... 其他属性 ...
} 