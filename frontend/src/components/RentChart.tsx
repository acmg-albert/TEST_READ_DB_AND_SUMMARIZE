import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import { TimeSeriesData } from '../types';

interface RentChartProps {
    title: string;
    timeSeriesData: TimeSeriesData;
    rentType: 'overall' | '1br' | '2br';
}

export const RentChart: React.FC<RentChartProps> = ({ title, timeSeriesData, rentType }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [timeRange, setTimeRange] = useState<[number, number]>([0, timeSeriesData.dates.length - 1]);
    
    const getOption = () => {
        const startIndex = timeRange[0];
        const endIndex = timeRange[1];
        
        const dates = timeSeriesData.dates.slice(startIndex, endIndex + 1);
        const values = timeSeriesData[rentType].values.slice(startIndex, endIndex + 1);
        const changes = timeSeriesData[rentType].yoy_changes.slice(startIndex, endIndex + 1);
        
        return {
            backgroundColor: 'transparent',
            title: {
                text: title,
                left: 'center',
                top: isMobile ? 0 : 10,
                textStyle: {
                    fontSize: isMobile ? 14 : 16
                }
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
                right: isMobile ? '8%' : '8%',
                left: isMobile ? '8%' : '6%',
                top: isMobile ? '25%' : '20%',
                bottom: '15%',
                backgroundColor: 'transparent',
                containLabel: true
            },
            legend: {
                data: [
                    'Rent',
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
                                        color: '#4CAF50'
                                    },
                                    {
                                        offset: 1,
                                        color: '#F44336'
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
                    }
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Rent ($)',
                    position: 'left',
                    axisLabel: {
                        formatter: '${value}',
                        fontSize: isMobile ? 10 : 12,
                        margin: isMobile ? 4 : 8
                    },
                    nameTextStyle: {
                        fontSize: isMobile ? 10 : 12,
                        padding: [0, 0, 0, 0]
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
                        formatter: '{value}%',
                        fontSize: isMobile ? 10 : 12,
                        margin: isMobile ? 4 : 8
                    },
                    nameTextStyle: {
                        fontSize: isMobile ? 10 : 12,
                        padding: [0, 0, 0, 0]
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
                    end: 100,
                    height: isMobile ? 20 : 30,
                    bottom: isMobile ? 5 : 10,
                    left: isMobile ? '8%' : '6%',
                    right: isMobile ? '8%' : '8%'
                }
            ],
            series: [
                {
                    name: 'Rent',
                    type: 'line',
                    data: values,
                    yAxisIndex: 0,
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
                    data: changes,
                    yAxisIndex: 1,
                    itemStyle: {
                        color: function(params: any) {
                            return params.value >= 0 ? '#4CAF50' : '#F44336';
                        }
                    }
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
        <Paper 
            elevation={3} 
            sx={{ 
                p: isMobile ? '0.5rem 0.5rem' : 1,
                mb: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
            }}
        >
            <ReactECharts
                option={getOption()}
                style={{
                    height: '400px',
                    width: '100%'
                }}
                onEvents={{
                    dataZoom: onTimeRangeChange
                }}
            />
        </Paper>
    );
}; 