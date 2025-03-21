-- 创建数据库
CREATE DATABASE IF NOT EXISTS it_version_management;

-- 使用数据库
USE it_version_management;

-- 创建版本表
CREATE TABLE IF NOT EXISTS versions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  priority INT NOT NULL,
  summary TEXT NOT NULL,
  start_date DATE NOT NULL,
  online_date DATE NOT NULL, -- 将 end_date 改为 online_date
  requirement_complete_date DATE, -- 新增需求完成时间
  development_complete_date DATE, -- 新增开发完成时间
  testing_complete_date DATE, -- 新增测试完成时间
  status ENUM('planning', 'development', 'testing', 'release', 'completed') NOT NULL,
  progress INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入一些示例数据
INSERT INTO versions (name, priority, summary, start_date, online_date, requirement_complete_date, development_complete_date, testing_complete_date, status, progress)
VALUES 
('版本 1.0.0', 3, '初始版本发布', '2023-01-01', '2023-02-15', '2023-01-10', '2023-01-20', '2023-02-05', 'completed', 100),
('版本 1.1.0', 2, '新增用户管理功能', '2023-02-20', '2023-03-30', '2023-02-25', '2023-03-10', '2023-03-20', 'testing', 80),
('版本 1.2.0', 4, '修复安全漏洞', '2023-04-01', '2023-04-15', '2023-04-05', '2023-04-10', NULL, 'development', 50),
('版本 2.0.0', 4, '重大升级，全新界面设计', '2023-05-01', '2023-07-30', NULL, NULL, NULL, 'planning', 10); 