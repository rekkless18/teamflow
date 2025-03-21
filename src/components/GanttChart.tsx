const statusColors: { [key: string]: string } = {
    planning: '#f0ad4e',
    development: '#5bc0de',
    testing: '#5cb85c',
    release: '#d9534f',
    completed: '#5cb85c',
}; 

const startDate = version.start_date ? new Date(version.start_date) : new Date();
const endDate = version.end_date ? new Date(version.end_date) : new Date();

const duration = differenceInDays(endDate, startDate) + 1;

return {
    ...version,
    name: version.name,
    startDate,
    endDate,
    duration,
    color: statusColors[version.status] || '#6b7280',
};

const sortedData = [...chartData].sort((a, b) => {
    const aStart = a.startDate?.getTime() || 0;
    const bStart = b.startDate?.getTime() || 0;
    return aStart - bStart;
});

let minDate = sortedData[0]?.startDate || new Date();
let maxDate = sortedData[0]?.endDate || new Date();

sortedData.forEach(item => {
    if (item.startDate && item.startDate < minDate) minDate = item.startDate;
    if (item.endDate && item.endDate > maxDate) maxDate = item.endDate;
}); 