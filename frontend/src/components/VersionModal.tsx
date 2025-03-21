// VersionModal.tsx
import React, { useState } from 'react';
import { createVersion, updateVersion, Version, Priority } from '../services/api';
import { format, parseISO } from 'date-fns';

const VersionModal: React.FC<{ version: Version | null; onClose: (shouldRefresh: boolean) => void }> = ({
  version,
  onClose,
}) => {
  const [formState, setFormState] = useState<Version>({
    id: version?.id || 0, // 确保 id 是 number 类型
    name: version?.name || '',
    priority: version?.priority || Priority.MEDIUM,
    summary: version?.summary || '',
    start_date: version?.start_date || new Date(),
    end_date: version?.end_date || new Date(),
    status: version?.status || 'planning',
    progress: version?.progress || 0,
    requirement_complete_date: version?.requirement_complete_date || undefined,
    development_complete_date: version?.development_complete_date || undefined,
    testing_complete_date: version?.testing_complete_date || undefined,
  });

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    if (typeof date === 'string') {
      return format(parseISO(date), 'yyyy-MM-dd');
    }
    return format(date, 'yyyy-MM-dd');
  };

  // 处理输入变化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === 'priority'? value as Priority : name === 'progress'? parseInt(value, 10) : value
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (version?.id) {
        await updateVersion(version.id, formState);
      } else {
        await createVersion(formState);
      }
      onClose(true);
    } catch (error) {
      console.error('保存版本失败', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{version?.id? '编辑版本' : '创建版本'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              名称
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              优先级
            </label>
            <select
              id="priority"
              name="priority"
              value={formState.priority}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value={Priority.LOW}>低</option>
              <option value={Priority.MEDIUM}>中</option>
              <option value={Priority.HIGH}>高</option>
              <option value={Priority.CRITICAL}>紧急</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
              概要
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formState.summary}
              onChange={handleChange}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                开始日期
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formatDate(formState.start_date)}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                结束日期
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formatDate(formState.end_date)}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              状态
            </label>
            <select
              id="status"
              name="status"
              value={formState.status}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="planning">规划中</option>
              <option value="development">开发中</option>
              <option value="testing">测试中</option>
              <option value="release">发布中</option>
              <option value="completed">已完成</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
              进度 ({formState.progress}%)
            </label>
            <input
              type="range"
              id="progress"
              name="progress"
              min="0"
              max="100"
              step="5"
              value={formState.progress}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VersionModal;