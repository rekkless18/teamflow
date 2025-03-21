import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createVersion, updateVersion, Version, Priority } from '../services/api';
import { format } from 'date-fns';

interface VersionModalProps {
  version: Version | null;
  onClose: (shouldRefresh: boolean) => void;
}

const VersionModal: React.FC<VersionModalProps> = ({ version, onClose }) => {
  const isEditMode = !!version;
  
  // 初始化表单状态
  const [formState, setFormState] = useState<Version>({
    name: '',
    priority: Priority.Medium,
    summary: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(new Date().setDate(new Date().getDate() + 14)), 'yyyy-MM-dd'),
    status: 'planning',
    progress: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 当编辑模式且有version数据时，填充表单
  useEffect(() => {
    if (version) {
      setFormState({
        ...version,
        start_date: typeof version.start_date === 'string' 
          ? version.start_date.split('T')[0] 
          : format(version.start_date, 'yyyy-MM-dd'),
        end_date: typeof version.end_date === 'string' 
          ? version.end_date.split('T')[0] 
          : format(version.end_date, 'yyyy-MM-dd'),
      });
    }
  }, [version]);

  // 处理输入变化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === 'priority' || name === 'progress' ? parseInt(value, 10) : value
    }));
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (isEditMode && version?.id) {
        await updateVersion(version.id, formState);
      } else {
        await createVersion(formState);
      }
      onClose(true); // 关闭模态窗口并刷新数据
    } catch (err) {
      console.error('保存版本失败', err);
      setError('保存版本失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onClose={() => onClose(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-medium">
              {isEditMode ? '编辑版本' : '创建新版本'}
            </Dialog.Title>
            <button 
              onClick={() => onClose(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  版本名称
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  优先级
                </label>
                <select
                  id="priority"
                  name="priority"
                  required
                  value={formState.priority}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value={Priority.Low}>低</option>
                  <option value={Priority.Medium}>中</option>
                  <option value={Priority.High}>高</option>
                  <option value={Priority.Critical}>紧急</option>
                </select>
              </div>

              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                  概要
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  required
                  rows={3}
                  value={formState.summary}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                    开始日期
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    required
                    value={typeof formState.start_date === 'string' ? formState.start_date : format(formState.start_date, 'yyyy-MM-dd')}
                    onChange={handleChange}
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
                    required
                    value={typeof formState.end_date === 'string' ? formState.end_date : format(formState.end_date, 'yyyy-MM-dd')}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  状态
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formState.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="planning">规划中</option>
                  <option value="development">开发中</option>
                  <option value="testing">测试中</option>
                  <option value="release">发布中</option>
                  <option value="completed">已完成</option>
                </select>
              </div>

              <div>
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
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => onClose(false)}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
              >
                {isSubmitting ? '保存中...' : '保存'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default VersionModal; 