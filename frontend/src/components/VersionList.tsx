// VersionList.tsx
import React, { useState, useEffect } from 'react';
import { getAllVersions, deleteVersion } from '../services/api';
import { Version, Priority } from '../services/api'; // 确保导入的是更新后的 Version 接口
import { format, parseISO } from 'date-fns';
import VersionModal from './VersionModal';
import GanttChart from './GanttChart';

const VersionList: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<Version | null>(null);
  const [view, setView] = useState<'list' | 'gantt'>('list');

  // 加载版本数据
  const loadVersions = async () => {
    try {
      const data = await getAllVersions();
      setVersions(data);
    } catch (error) {
      console.error('加载版本失败', error);
    }
  };

  useEffect(() => {
    loadVersions();
  }, []);

  // 打开创建版本模态窗口
  const handleCreateVersion = () => {
    setCurrentVersion(null);
    setIsModalOpen(true);
  };

  // 打开编辑版本模态窗口
  const handleEditVersion = (version: Version) => {
    setCurrentVersion(version);
    setIsModalOpen(true);
  };

  // 删除版本
  const handleDeleteVersion = async (id: number) => {
    if (window.confirm('确定要删除此版本吗？')) {
      try {
        await deleteVersion(id);
        loadVersions();
      } catch (error) {
        console.error('删除版本失败', error);
      }
    }
  };

  // 模态窗口关闭后重新加载数据
  const handleModalClose = (shouldRefresh: boolean) => {
    setIsModalOpen(false);
    if (shouldRefresh) {
      loadVersions();
    }
  };

  // 获取优先级标签
  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">低</span>;
      case Priority.MEDIUM:
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-200 text-blue-800">中</span>;
      case Priority.HIGH:
        return <span className="px-2 py-1 text-xs rounded-full bg-orange-200 text-orange-800">高</span>;
      case Priority.CRITICAL:
        return <span className="px-2 py-1 text-xs rounded-full bg-red-200 text-red-800">紧急</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">未知</span>;
    }
  };

  // 获取状态标签
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-200 text-purple-800">规划中</span>;
      case 'development':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-200 text-yellow-800">开发中</span>;
      case 'testing':
        return <span className="px-2 py-1 text-xs rounded-full bg-cyan-200 text-cyan-800">测试中</span>;
      case 'release':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-200 text-green-800">发布中</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">已完成</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">未知</span>;
    }
  };

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    if (typeof date === 'string') {
      return format(parseISO(date), 'yyyy-MM-dd');
    }
    return format(date, 'yyyy-MM-dd');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">IT版本管理</h1>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setView('list')}
            >
              列表视图
            </button>
            <button
              className={`px-4 py-2 rounded ${view === 'gantt' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setView('gantt')}
            >
              甘特图
            </button>
          </div>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            onClick={handleCreateVersion}
          >
            创建版本
          </button>
        </div>
      </div>

      {view === 'gantt' ? (
        <GanttChart versions={versions} />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">优先级</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">概要</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">开始日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">结束日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">进度</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">需求完成时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">开发完成时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">测试完成时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {versions.map((version) => (
                <tr key={version.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{version.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getPriorityLabel(version.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusLabel(version.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{version.summary}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(version.start_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(version.end_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${version.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{version.progress}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(version.requirement_complete_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(version.development_complete_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(version.testing_complete_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditVersion(version)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => version.id && handleDeleteVersion(version.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
              {versions.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-6 py-4 text-center text-sm text-gray-500">
                    暂无版本数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <VersionModal
          version={currentVersion}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default VersionList;