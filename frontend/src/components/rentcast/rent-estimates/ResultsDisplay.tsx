import React, { useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Link
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams
} from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import { RentCompsResponse, Comparable } from '../../../types/rentcast/rent-estimates/types';

interface ResultsDisplayProps {
    data: RentCompsResponse;
    targetAddress: string;
}

const formatCurrency = (value: number | undefined): string => {
    if (value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value);
};

const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US');
};

const formatPercent = (value: number | undefined): string => {
    if (value === undefined) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
};

const formatDistance = (value: number | undefined): string => {
    if (value === undefined) return 'N/A';
    return `${value.toFixed(2)} mi`;
};

const formatNumber = (value: number | undefined): string => {
    if (value === undefined) return 'N/A';
    return value.toLocaleString();
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, targetAddress }) => {
    // 计算 Median 和 Average Rent
    const { medianRent, averageRent } = useMemo(() => {
        const prices = data.comparables
            .map(comp => comp.price)
            .filter((price): price is number => price !== undefined)
            .sort((a, b) => a - b);
        const len = prices.length;
        const median = len % 2 === 0 
            ? (prices[len/2 - 1] + prices[len/2]) / 2 
            : prices[Math.floor(len/2)];
        const average = prices.reduce((a, b) => a + b, 0) / len;
        return { medianRent: median, averageRent: average };
    }, [data.comparables]);

    // 表格列定义
    const columns: GridColDef[] = [
        { 
            field: 'formattedAddress', 
            headerName: 'Address', 
            minWidth: 200,
            flex: 1,
            sortable: true,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams) => (
                <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(params.value)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        color: '#0AB3B0',
                        textDecoration: 'none',
                        '&:hover': {
                            textDecoration: 'underline'
                        }
                    }}
                >
                    {params.value}
                </Link>
            )
        },
        { 
            field: 'correlation', 
            headerName: 'Similarity', 
            width: 130,
            sortable: true,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams) => formatPercent(params.value)
        },
        { 
            field: 'price', 
            headerName: 'Listing Rent', 
            width: 140,
            sortable: true,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams) => formatCurrency(params.value)
        },
        { 
            field: 'listedDate', 
            headerName: 'Listing Date', 
            width: 140,
            sortable: true,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams) => formatDate(params.value)
        },
        { 
            field: 'daysOnMarket', 
            headerName: 'Days on Market', 
            width: 150,
            sortable: true,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams) => formatNumber(params.value)
        },
        { 
            field: 'distance', 
            headerName: 'Distance (mi)', 
            width: 140,
            sortable: true,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams) => formatDistance(params.value)
        },
        { 
            field: 'yearBuilt', 
            headerName: 'Year Built', 
            width: 120,
            sortable: true,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams) => formatNumber(params.value)
        },
        { 
            field: 'bedrooms', 
            headerName: 'Bedrooms', 
            width: 130,
            sortable: true,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams) => formatNumber(params.value)
        },
        { 
            field: 'bathrooms', 
            headerName: 'Bathrooms', 
            width: 140,
            sortable: true,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams) => formatNumber(params.value)
        },
        { 
            field: 'squareFootage', 
            headerName: 'Square Footage', 
            width: 150,
            sortable: true,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams) => formatNumber(params.value)
        },
        { 
            field: 'propertyType', 
            headerName: 'Property Type', 
            width: 140,
            sortable: true,
            headerClassName: 'super-app-theme--header',
            renderCell: (params: GridRenderCellParams) => params.value || 'N/A'
        }
    ];

    // 准备表格数据
    const rows = useMemo(() => {
        return data.comparables
            .sort((a, b) => (b.correlation ?? 0) - (a.correlation ?? 0)) // 默认按相似度降序排序，处理 undefined
            .map((comp, index) => {
                const { id, ...rest } = comp; // 解构出 id，避免重复
                return {
                    id: `comp-${index}`, // 使用唯一的字符串ID
                    ...rest
                };
            });
    }, [data.comparables]);

    // 处理 CSV 下载
    const handleDownload = () => {
        // 准备CSV表头
        const headers = [
            'formattedAddress',
            'addressLine1',
            'addressLine2',
            'city',
            'state',
            'zipCode',
            'county',
            'latitude',
            'longitude',
            'propertyType',
            'bedrooms',
            'bathrooms',
            'squareFootage',
            'lotSize',
            'yearBuilt',
            'price',
            'listingType',
            'listedDate',
            'removedDate',
            'lastSeenDate',
            'daysOnMarket',
            'distance',
            'daysOld',
            'correlation'
        ].join(',');

        // 转换comparables数据为CSV行
        const csvRows = data.comparables.map(comp => {
            return [
                `"${comp.formattedAddress}"`,
                `"${comp.addressLine1}"`,
                `"${comp.addressLine2 || ''}"`,
                `"${comp.city}"`,
                `"${comp.state}"`,
                `"${comp.zipCode}"`,
                `"${comp.county}"`,
                comp.latitude,
                comp.longitude,
                `"${comp.propertyType}"`,
                comp.bedrooms,
                comp.bathrooms,
                comp.squareFootage || '',
                comp.lotSize || '',
                comp.yearBuilt || '',
                comp.price,
                `"${comp.listingType}"`,
                `"${comp.listedDate}"`,
                `"${comp.removedDate || ''}"`,
                `"${comp.lastSeenDate}"`,
                comp.daysOnMarket,
                comp.distance,
                comp.daysOld,
                comp.correlation
            ].join(',');
        });

        // 组合CSV内容
        const csvContent = [headers, ...csvRows].join('\n');

        // 创建Blob对象并下载
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'rent_comparables.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box sx={{ mt: 4 }}>
            {/* 目标地址标题 */}
            <Typography 
                variant="h5" 
                align="center" 
                sx={{ 
                    mb: 3,
                    color: '#0AB3B0',
                    fontWeight: 'bold'
                }}
            >
                {targetAddress}
            </Typography>

            {/* 汇总信息卡片 */}
            <Card sx={{ mb: 4, backgroundColor: '#f5f5f5' }}>
                <CardContent>
                    <Typography 
                        variant="h6" 
                        align="center" 
                        sx={{ mb: 3 }}
                    >
                        Rent Statistics Summary
                    </Typography>
                    <Grid 
                        container 
                        spacing={3} 
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            textAlign: 'center',
                            '& .MuiGrid-item': {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }
                        }}
                    >
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Estimated Rent
                            </Typography>
                            <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
                                {formatCurrency(data.rent)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Lowest Rent
                            </Typography>
                            <Typography variant="h5" sx={{ mt: 1 }}>
                                {formatCurrency(data.rentRangeLow)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Highest Rent
                            </Typography>
                            <Typography variant="h5" sx={{ mt: 1 }}>
                                {formatCurrency(data.rentRangeHigh)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Median Rent
                            </Typography>
                            <Typography variant="h5" sx={{ mt: 1 }}>
                                {formatCurrency(medianRent)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Average Rent
                            </Typography>
                            <Typography variant="h5" sx={{ mt: 1 }}>
                                {formatCurrency(averageRent)}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* 表格标题和下载按钮 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Comparable Properties ({data.comparables.length})
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                    sx={{
                        backgroundColor: '#0AB3B0',
                        '&:hover': {
                            backgroundColor: '#089690'
                        }
                    }}
                >
                    DOWNLOAD FULL DATA
                </Button>
            </Box>

            {/* 数据表格 */}
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'correlation', sort: 'desc' }]
                    }
                }}
                autoHeight
                density="comfortable"
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50, 100]}
                sx={{
                    '& .MuiDataGrid-root': {
                        width: '100%',
                        overflowX: 'auto'
                    },
                    '& .MuiDataGrid-cell': {
                        whiteSpace: 'normal',
                        lineHeight: 'normal',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    },
                    '& .super-app-theme--header': {
                        backgroundColor: '#f5f5f5',
                        whiteSpace: 'normal',
                        lineHeight: '1.2',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        '& .MuiDataGrid-columnHeaderTitleContainer': {
                            padding: '4px',
                            width: '100%'
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            whiteSpace: 'normal',
                            lineHeight: '1.2',
                            fontSize: {
                                xs: '0.75rem',
                                sm: '0.875rem'
                            },
                            fontWeight: 'bold',
                            overflow: 'visible',
                            textOverflow: 'clip',
                            width: '100%'
                        }
                    },
                    '& .MuiDataGrid-columnHeader': {
                        padding: '0',
                        height: 'auto !important'
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        borderBottom: '2px solid #e0e0e0',
                        minHeight: '48px !important',
                        maxHeight: 'none !important'
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': {
                            height: '8px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#bdbdbd',
                            borderRadius: '4px'
                        }
                    }
                }}
            />
        </Box>
    );
}; 