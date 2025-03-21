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

// 状态颜色映射
const statusColors = {
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
    
    const duration = differenceInDays(endDate, startDate) + 1; // 包括开始和结束日期
    
    return {
      ...version,
      name: version.name,
      startDate,
      endDate,
      duration,
      color: statusColors[version.status] || '#6b7280',
    };
  });

  // 对数据按开始日期排序
  const sortedData = [...chartData].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // 找出整个项目的时间跨度
  let minDate = sortedData[0]?.startDate || new Date();
  let maxDate = sortedData[0]?.endDate || new Date();

  sortedData.forEach(item => {
    if (item.startDate < minDate) minDate = item.startDate;
    if (item.endDate > maxDate) maxDate = item.endDate;
  });

  // 为了美观，稍微扩大时间范围
  minDate = addDays(minDate, -1);
  maxDate = addDays(maxDate, 1);

  // 格式化工具提示内容
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">
            {format(data.startDate, 'yyyy-MM-dd')} 至 {format(data.endDate, 'yyyy-MM-dd')}
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