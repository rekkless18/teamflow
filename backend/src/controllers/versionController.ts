import { Request, Response } from 'express';
import { Version } from '../models/Version';

// 获取所有版本
export const getAllVersions = async (req: Request, res: Response) => {
  try {
    const versions = (req as any).mockData.versions;
    res.json(versions);
  } catch (error) {
    console.error('Error fetching versions:', error);
    res.status(500).json({ message: '获取版本列表失败' });
  }
};

// 获取单个版本
export const getVersionById = async (req: Request, res: Response) => {
  try {
    const versions = (req as any).mockData.versions;
    const version = versions.find((v: any) => v.id === parseInt(req.params.id));
    
    if (!version) {
      return res.status(404).json({ message: '找不到该版本' });
    }
    
    res.json(version);
  } catch (error) {
    console.error('Error fetching version:', error);
    res.status(500).json({ message: '获取版本详情失败' });
  }
};

// 创建新版本
export const createVersion = async (req: Request, res: Response) => {
  try {
    const versions = (req as any).mockData.versions;
    const { name, priority, summary, start_date, end_date, status, progress } = req.body as Version;
    
    // 查找最大ID
    const maxId = versions.reduce((max: number, v: any) => (v.id > max ? v.id : max), 0);
    
    // 创建新版本对象
    const newVersion = {
      id: maxId + 1,
      name,
      priority,
      summary,
      start_date,
      end_date,
      status,
      progress,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };
    
    // 添加到数组中
    versions.push(newVersion);
    
    res.status(201).json(newVersion);
  } catch (error) {
    console.error('Error creating version:', error);
    res.status(500).json({ message: '创建版本失败' });
  }
};

// 更新版本
export const updateVersion = async (req: Request, res: Response) => {
  try {
    const versions = (req as any).mockData.versions;
    const id = parseInt(req.params.id);
    const { name, priority, summary, start_date, end_date, status, progress } = req.body as Version;
    
    // 查找要更新的版本索引
    const index = versions.findIndex((v: any) => v.id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: '找不到该版本' });
    }
    
    // 更新版本对象
    const updatedVersion = {
      ...versions[index],
      name,
      priority,
      summary,
      start_date,
      end_date,
      status,
      progress,
      updated_at: new Date().toISOString().split('T')[0]
    };
    
    // 替换数组中的对象
    versions[index] = updatedVersion;
    
    res.json(updatedVersion);
  } catch (error) {
    console.error('Error updating version:', error);
    res.status(500).json({ message: '更新版本失败' });
  }
};

// 删除版本
export const deleteVersion = async (req: Request, res: Response) => {
  try {
    const versions = (req as any).mockData.versions;
    const id = parseInt(req.params.id);
    
    // 查找要删除的版本索引
    const index = versions.findIndex((v: any) => v.id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: '找不到该版本' });
    }
    
    // 从数组中删除
    versions.splice(index, 1);
    
    res.json({ message: '版本已成功删除' });
  } catch (error) {
    console.error('Error deleting version:', error);
    res.status(500).json({ message: '删除版本失败' });
  }
}; 