import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Version } from '../services/api';
import { parseISO, format, differenceInDays, addDays } from 'date-fns';

interface GanttChartProps {
  versions: Version[];
}

// 状态颜色映射，明确索引类型
const statusColors: { [key in 'planning' | 'development' | 'testing' | 'release' | 'completed']: string } = {
  planning: '#9333ea', // purple
  development: '#eab308', // yellow
  testing: '#06b6d4', // cyan
  release: '#22c55e', // green
  completed: '#6b7280', // gray
};

const GanttChart: React.FC<GanttChartProps> = ({ versions }) => {
  // 如果没有版本数据，显示提示信息
  if (versions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">暂无版本数据</p>
      </div>
    );
  }

  // 处理日期格式并计算项目持续时间
  const chartData = versions.map(version => {
    const startDate = typeof version.start_date === 'string' 
      ? parseISO(version.start_date) 
      : version.start_date;
    
    const endDate = typeof version.end_date === 'string' 
      ? parseISO(version.end_date) 
      : version.end_date;
    
    let duration = 0;
    // 确保 startDate 和 endDate 不是 undefined 再计算 duration
    if (startDate && endDate) {
      duration = differenceInDays(endDate, startDate) + 1; 
    }

    const versionWithStatus = version as Version & { status?: keyof typeof statusColors; name?: string };
    
    return {
      ...version,
      // 假设添加 name 属性到 Version 接口，这里做个默认处理
      name: versionWithStatus.name || '未命名', 
      startDate,
      endDate,
      duration,
      // 明确 status 类型并处理可能的 undefined
      color: versionWithStatus.status 
        ? statusColors[versionWithStatus.status] 
        : '#6b7280',
    };
  });

  // 对数据按开始日期排序，处理可能的 undefined
  const sortedData = [...chartData].sort((a, b) => {
    if (!a.startDate && !b.startDate) return 0;
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return a.startDate.getTime() - b.startDate.getTime();
  });

  // 找出整个项目的时间跨度
  let minDate = sortedData[0]?.startDate || new Date();
  let maxDate = sortedData[0]?.endDate || new Date();

  sortedData.forEach(item => {
    // 处理 startDate 可能为 undefined 的情况
    if (item.startDate && item.startDate < minDate) {
      minDate = item.startDate;
    }
    // 处理 endDate 可能为 undefined 的情况
    if (item.endDate && item.endDate > maxDate) {
      maxDate = item.endDate;
    }
  });

  // 为了美观，稍微扩大时间范围
  minDate = addDays(minDate, -1);
  maxDate = addDays(maxDate, 1);

  // 格式化工具提示内容，处理可能的 undefined
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.startDate ? format(data.startDate, 'yyyy-MM-dd') : '未知'} 至 {data.endDate ? format(data.endDate, 'yyyy-MM-dd') : '未知'}
          </p>
          <p className="text-sm text-gray-600">优先级: {data.priority}</p>
          <p className="text-sm text-gray-600">进度: {data.progress}%</p>
          <p className="text-sm text-gray-600 max-w-xs truncate">概要: {data.summary}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">项目甘特图</h2>
      <ResponsiveContainer width="100%" height={versions.length * 60 + 50} minHeight={300}>
        <BarChart
          layout="vertical"
          data={sortedData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            dataKey="duration"
            domain={[0, differenceInDays(maxDate, minDate)]}
            tickFormatter={(value: number) => format(addDays(minDate, value), 'MM/dd')}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            width={100}
          />
          <Tooltip content={customTooltip} />
          <Bar 
            dataKey="duration" 
            background={{ fill: '#eee' }}
            radius={[4, 4, 4, 4]}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GanttChart;    