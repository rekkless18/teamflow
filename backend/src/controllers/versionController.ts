import { Request, Response } from 'express';
import pool from '../config/db';

// 获取所有版本
export const getAllVersions = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM versions');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching versions:', error);
        res.status(500).json({ message: '获取版本列表失败' });
    }
};

// 获取单个版本
export const getVersionById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const [rows] = await pool.execute('SELECT * FROM versions WHERE id = ?', [id]);
        const version = rows[0];

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
        const { name, priority, summary, start_date, online_date, requirement_complete_date, development_complete_date, testing_complete_date, status, progress } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO versions (name, priority, summary, start_date, online_date, requirement_complete_date, development_complete_date, testing_complete_date, status, progress, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,CURDATE(),CURDATE())',
            [name, priority, summary, start_date, online_date, requirement_complete_date, development_complete_date, testing_complete_date, status, progress]
        );
        const newVersionId = (result as any).insertId;
        const [newVersionRows] = await pool.execute('SELECT * FROM versions WHERE id = ?', [newVersionId]);
        const newVersion = newVersionRows[0];

        res.status(201).json(newVersion);
    } catch (error) {
        console.error('Error creating version:', error);
        res.status(500).json({ message: '创建版本失败' });
    }
};

// 更新版本
export const updateVersion = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { name, priority, summary, start_date, online_date, requirement_complete_date, development_complete_date, testing_complete_date, status, progress } = req.body;
        await pool.execute(
            'UPDATE versions SET name = ?, priority = ?, summary = ?, start_date = ?, online_date = ?, requirement_complete_date = ?, development_complete_date = ?, testing_complete_date = ?, status = ?, progress = ?, updated_at = CURDATE() WHERE id = ?',
            [name, priority, summary, start_date, online_date, requirement_complete_date, development_complete_date, testing_complete_date, status, progress, id]
        );
        const [updatedVersionRows] = await pool.execute('SELECT * FROM versions WHERE id = ?', [id]);
        const updatedVersion = updatedVersionRows[0];

        res.json(updatedVersion);
    } catch (error) {
        console.error('Error updating version:', error);
        res.status(500).json({ message: '更新版本失败' });
    }
};

// 删除版本
export const deleteVersion = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const [result] = await pool.execute('DELETE FROM versions WHERE id = ?', [id]);
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ message: '找不到该版本' });
        }
        res.json({ message: '版本已成功删除' });
    } catch (error) {
        console.error('Error deleting version:', error);
        res.status(500).json({ message: '删除版本失败' });
    }
};