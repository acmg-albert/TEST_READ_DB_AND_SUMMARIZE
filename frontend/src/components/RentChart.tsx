import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { TimeSeriesData } from '../types';

interface RentChartProps {
    title: string;
    timeSeriesData: TimeSeriesData;
    rentType: 'overall' | '1br' | '2br';
}

export const RentChart: React.FC<RentChartProps> = ({ title, timeSeriesData, rentType }) => {
    const [timeRange, setTimeRange] = useState<[number, number]>([0, timeSeriesData.dates.length - 1]);
    
    const getOption = () => {
        const startIndex = timeRange[0];
        const endIndex = timeRange[1];
        
        const dates = timeSeriesData.dates.slice(startIndex, endIndex + 1);
        const values = timeSeriesData[rentType].values.slice(startIndex, endIndex + 1);
        const changes = timeSeriesData[rentType].yoy_changes.slice(startIndex, endIndex + 1);
        
        return {
            title: {
                text: title,
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                formatter: function (params: any) {
                    const date = params[0].axisValue;
                    let result = `${date}<br/>`;
                    params.forEach((param: any) => {
                        const marker = param.marker;
                        const seriesName = param.seriesName;
                        const value = param.value;
                        if (seriesName === 'Rent') {
                            result += `${marker}${seriesName}: $${value?.toLocaleString()}<br/>`;
                        } else if (seriesName === 'YoY Change') {
                            result += `${marker}${seriesName}: ${value?.toFixed(2)}%<br/>`;
                        }
                    });
                    return result;
                }
            },
            grid: {
                right: '15%',
                left: '12%',
                backgroundColor: 'rgba(211, 211, 211, 0.1)',
                show: true,
                borderColor: 'transparent'
            },
            legend: {
                data: ['Rent', 'YoY Change'],
                top: 25
            },
            xAxis: {
                type: 'category',
                data: dates,
                boundaryGap: false,
                splitLine: {
                    show: false
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Rent ($)',
                    position: 'left',
                    axisLabel: {
                        formatter: '${value}',
                        align: 'right'
                    },
                    splitLine: {
                        show: false
                    }
                },
                {
                    type: 'value',
                    name: 'YoY Change (%)',
                    position: 'right',
                    axisLabel: {
                        formatter: '{value}%'
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                }
            ],
            series: [
                {
                    name: 'Rent',
                    type: 'line',
                    data: values,
                    yAxisIndex: 0,
                    symbol: 'none',
                    lineStyle: {
                        width: 3
                    }
                },
                {
                    name: 'YoY Change',
                    type: 'bar',
                    data: changes,
                    yAxisIndex: 1
                }
            ]
        };
    };

    const onTimeRangeChange = (params: any) => {
        if (params.batch) {
            const [{ start, end }] = params.batch;
            const startIndex = Math.floor(timeSeriesData.dates.length * start / 100);
            const endIndex = Math.ceil(timeSeriesData.dates.length * end / 100);
            setTimeRange([startIndex, endIndex]);
        }
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <ReactECharts
                option={getOption()}
                style={{ height: '400px' }}
                onEvents={{
                    dataZoom: onTimeRangeChange
                }}
            />
        </div>
    );
}; 