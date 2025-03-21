# IT版本管理系统

这是一个用于管理IT版本的全栈应用程序，具有列表视图和甘特图功能。

## 功能特点

- 查看所有版本的进度列表
- 项目甘特图可视化
- 创建、编辑和删除版本
- 版本优先级管理
- 项目进度跟踪

## 技术栈

### 前端
- React (TypeScript)
- Tailwind CSS
- Recharts (甘特图)
- Headless UI (模态窗口)
- Hero Icons
- Axios (API请求)
- date-fns (日期处理)

### 后端
- Node.js
- Express
- MySQL数据库
- RESTful API设计

## 项目结构

```
/
├── frontend/              # React前端
│   ├── public/            # 静态资源
│   └── src/               # 源代码
│       ├── components/    # React组件
│       └── services/      # API服务
├── backend/               # Node.js后端
│   ├── src/               # 源代码
│   │   ├── config/        # 配置文件
│   │   ├── controllers/   # 控制器
│   │   ├── models/        # 数据模型
│   │   └── routes/        # API路由
│   └── .env               # 环境变量
└── README.md              # 项目说明
```

## 使用指南

### 后端

1. 初始化数据库：
   ```
   mysql -u root -p < backend/src/config/init-db.sql
   ```

2. 安装依赖并启动后端服务：
   ```
   cd backend
   npm install
   npm run dev
   ```

### 前端

1. 安装依赖并启动前端服务：
   ```
   cd frontend
   npm install
   npm start
   ```

2. 访问应用：
   打开浏览器访问 http://localhost:3000

## API设计

后端提供RESTful API进行版本管理：

- `GET /api/versions` - 获取所有版本
- `GET /api/versions/:id` - 获取单个版本详情
- `POST /api/versions` - 创建新版本
- `PUT /api/versions/:id` - 更新版本信息
- `DELETE /api/versions/:id` - 删除版本 