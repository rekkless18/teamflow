import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import versionRoutes from './routes/versionRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 自定义中间件：添加模拟数据
app.use((req, res, next) => {
  // 添加测试数据到请求对象
  (req as any).mockData = {
    versions: [
      {
        id: 1,
        name: '版本 1.0.0',
        priority: 3,
        summary: '初始版本发布',
        start_date: '2023-01-01',
        end_date: '2023-02-15',
        status: 'completed',
        progress: 100,
        created_at: '2023-01-01',
        updated_at: '2023-02-15'
      },
      {
        id: 2,
        name: '版本 1.1.0',
        priority: 2,
        summary: '新增用户管理功能',
        start_date: '2023-02-20',
        end_date: '2023-03-30',
        status: 'testing',
        progress: 80,
        created_at: '2023-02-20',
        updated_at: '2023-03-15'
      },
      {
        id: 3,
        name: '版本 1.2.0',
        priority: 4,
        summary: '修复安全漏洞',
        start_date: '2023-04-01',
        end_date: '2023-04-15',
        status: 'development',
        progress: 50,
        created_at: '2023-04-01',
        updated_at: '2023-04-10'
      },
      {
        id: 4,
        name: '版本 2.0.0',
        priority: 4,
        summary: '重大升级，全新界面设计',
        start_date: '2023-05-01',
        end_date: '2023-07-30',
        status: 'planning',
        progress: 10,
        created_at: '2023-05-01',
        updated_at: '2023-05-01'
      }
    ]
  };
  next();
});

// 路由
app.get('/', (req, res) => {
  res.send('IT版本管理系统API正在运行');
});

// 导入路由
app.use('/api/versions', versionRoutes);

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 