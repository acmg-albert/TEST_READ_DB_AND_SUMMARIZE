import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme, useMediaQuery } from '@mui/material';
import { TimeSeriesData } from '../../../types/apartmentlist/vacancy/types';

interface VacancyChartProps {
    title: string;
    timeSeriesData: TimeSeriesData;
}

export const VacancyChart: React.FC<VacancyChartProps> = ({ title, timeSeriesData }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [timeRange, setTimeRange] = useState<[number, number]>([0, timeSeriesData.dates.length - 1]);

    const getOption = () => {
        const startIndex = timeRange[0];
        const endIndex = timeRange[1];
        
        const dates = timeSeriesData.dates.slice(startIndex, endIndex + 1);
        const vacancyValues = timeSeriesData.vacancy_index.values.slice(startIndex, endIndex + 1).map(value => value * 100);
        const yoyChanges = timeSeriesData.vacancy_index.yoy_changes.slice(startIndex, endIndex + 1).map(value => value / 100);

        return {
            title: {
                text: title,
                left: 'center',
                top: isMobile ? 0 : 10,
                textStyle: {
                    fontSize: isMobile ? 14 : 18,
                    fontWeight: 'bold',
                    color: '#333'
                },
                padding: [0, 0, 10, 0]
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#666565',
                        formatter: function(params: any) {
                            if (params.axisDimension === 'y') {
                                if (params.axisIndex === 0) {
                                    return `${params.value.toFixed(2)}%`;
                                } else {
                                    return `${(params.value * 100).toFixed(2)}%`;
                                }
                            }
                            return params.value;
                        }
                    }
                },
                backgroundColor: 'rgba(50, 50, 50, 0.9)',
                borderColor: '#666565',
                textStyle: {
                    color: '#fff'
                },
                formatter: function (params: any) {
                    const date = params[0].axisValue;
                    let result = `${date}<br/>`;
                    params.forEach((param: any) => {
                        const marker = param.marker;
                        const seriesName = param.seriesName;
                        const value = param.value;
                        if (seriesName === 'Vacancy Rate') {
                            result += `${marker}${seriesName}: ${value.toFixed(2)}%<br/>`;
                        } else if (seriesName === 'YoY Change') {
                            result += `${marker}${seriesName}: ${(value * 100).toFixed(2)}%<br/>`;
                        }
                    });
                    return result;
                }
            },
            legend: {
                data: [
                    'Vacancy Rate',
                    {
                        name: 'YoY Change',
                        icon: 'rect',
                        itemStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 0,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#34A853'
                                    },
                                    {
                                        offset: 1,
                                        color: '#EA4335'
                                    }
                                ]
                            }
                        }
                    }
                ],
                top: isMobile ? 30 : '8%',
                left: 'center',
                orient: 'horizontal',
                itemGap: isMobile ? 20 : 30,
                textStyle: {
                    fontSize: isMobile ? 12 : 14,
                    color: '#666565'
                },
                itemWidth: isMobile ? 15 : 20,
                itemHeight: isMobile ? 10 : 12,
                padding: [5, 10]
            },
            grid: {
                right: isMobile ? '5%' : '8%',
                left: isMobile ? '5%' : '6%',
                top: isMobile ? '25%' : '20%',
                bottom: isMobile ? '18%' : '20%',
                backgroundColor: 'transparent',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: { title: 'Save' },
                    restore: { title: 'Restore' }
                },
                top: isMobile ? 0 : 10,
                right: isMobile ? '5%' : '8%',
                itemSize: isMobile ? 15 : 20,
                itemGap: 10
            },
            xAxis: {
                type: 'category',
                data: dates,
                boundaryGap: true,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    fontSize: isMobile ? 10 : 12,
                    interval: function (index: number, value: string) {
                        const monthInterval = isMobile ? 6 : 4;
                        const date = new Date(value);
                        const month = date.getMonth();
                        if (month === 0) {
                            return true;
                        }
                        return index % monthInterval === 0;
                    },
                    rotate: isMobile ? 45 : 30,
                    formatter: function (value: string) {
                        return value;
                    },
                    color: '#666565'
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisTick: {
                    show: true,
                    alignWithLabel: true,
                    length: 4,
                    lineStyle: {
                        color: '#ddd'
                    }
                }
            },
            yAxis: [{
                type: 'value',
                name: 'Vacancy Rate (%)',
                position: 'left',
                nameTextStyle: {
                    fontSize: isMobile ? 10 : 12,
                    padding: [0, 0, 0, 0]
                },
                axisLabel: {
                    fontSize: isMobile ? 10 : 12,
                    margin: isMobile ? 4 : 8,
                    formatter: '{value}%'
                },
                splitLine: {
                    show: false
                }
            },
            {
                type: 'value',
                name: 'YoY Change (%)',
                position: 'right',
                nameTextStyle: {
                    fontSize: isMobile ? 10 : 12,
                    padding: [0, 0, 0, 0]
                },
                axisLabel: {
                    fontSize: isMobile ? 10 : 12,
                    margin: isMobile ? 4 : 8,
                    formatter: function(value: number) {
                        return `${(value * 100).toFixed(1)}%`;
                    }
                },
                splitLine: {
                    show: false
                }
            }],
            dataZoom: [{
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100,
                height: isMobile ? 20 : 25,
                bottom: isMobile ? '3%' : '5%',
                left: isMobile ? '8%' : '6%',
                right: isMobile ? '8%' : '8%',
                moveHandleSize: 0,
                brushSelect: false,
                handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
                handleSize: '100%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                },
                textStyle: {
                    fontSize: isMobile ? 10 : 12
                }
            }],
            series: [{
                name: 'Vacancy Rate',
                type: 'line',
                data: vacancyValues,
                yAxisIndex: 0,
                symbol: 'circle',
                symbolSize: 8,
                smooth: true,
                itemStyle: {
                    color: '#2196F3'
                },
                lineStyle: {
                    width: 3
                }
            },
            {
                name: 'YoY Change',
                type: 'bar',
                data: yoyChanges,
                yAxisIndex: 1,
                itemStyle: {
                    color: function(params: any) {
                        return params.value >= 0 ? '#34A853' : '#EA4335';
                    }
                }
            }],
            color: ['#2196F3', {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 0,
                colorStops: [{
                    offset: 0,
                    color: '#34A853'
                }, {
                    offset: 1,
                    color: '#EA4335'
                }]
            }]
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
        <div style={{ 
            height: isMobile ? '450px' : '500px', 
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
        }}>
            <ReactECharts
                option={getOption()}
                style={{ height: '100%' }}
                opts={{ renderer: 'canvas' }}
                onEvents={{
                    dataZoom: onTimeRangeChange
                }}
            />
        </div>
    );
}; 