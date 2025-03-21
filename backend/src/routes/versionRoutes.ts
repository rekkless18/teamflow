import express, { RequestHandler } from 'express';
import { 
  getAllVersions, 
  getVersionById, 
  createVersion, 
  updateVersion, 
  deleteVersion 
} from '../controllers/versionController';

const router = express.Router();

// 获取所有版本
router.get('/', getAllVersions as RequestHandler);

// 获取单个版本
router.get('/:id', getVersionById as RequestHandler);

// 创建新版本
router.post('/', createVersion as RequestHandler);

// 更新版本
router.put('/:id', updateVersion as RequestHandler);

// 删除版本
router.delete('/:id', deleteVersion as RequestHandler);

export default router; 