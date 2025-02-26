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
                bottom: isMobile ? '18%' : '20%',
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
                    height: isMobile ? '450px' : '500px',
                    width: '100%'
                }}
                onEvents={{
                    dataZoom: onTimeRangeChange
                }}
            />
        </Paper>
    );
}; 