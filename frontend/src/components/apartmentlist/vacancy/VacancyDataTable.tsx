import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box
} from '@mui/material';
import { LocationData } from '../../../types/apartmentlist/vacancy/types';

interface VacancyDataTableProps {
    title: string;
    topLocations: LocationData[];
    bottomLocations: LocationData[];
    locationType: string;
}

export const VacancyDataTable: React.FC<VacancyDataTableProps> = ({ 
    title, 
    topLocations = [], 
    bottomLocations = [], 
    locationType 
}) => {
    const navigate = useNavigate();

    const handleLocationClick = (location: LocationData) => {
        navigate(`/rental/apartments-vacancy/details/${location.location_type}/${location.location_name}`);
    };

    const formatPercent = (value: number | undefined) => {
        if (value === undefined) return 'N/A';
        return `${value.toFixed(2)}%`;
    };

    const formatVacancyRate = (value: number | undefined) => {
        if (value === undefined) return 'N/A';
        return `${(value * 100).toFixed(2)}%`;
    };

    const getMonthHeaders = () => {
        const firstLocation = topLocations[0];
        const monthlyData = firstLocation?.monthly_data || [];
        if (monthlyData.length >= 3) {
            return [2, 1, 0].map((monthIndex) => {
                const monthData = monthlyData[monthIndex];
                return (
                    <TableCell key={monthIndex} align="right">
                        {monthData?.date?.replace('_', '-')} Vacancy
                    </TableCell>
                );
            });
        }
        // 如果没有数据，返回默认的月份列标题
        return [
            <TableCell key="m1" align="right">Month 1 Vacancy</TableCell>,
            <TableCell key="m2" align="right">Month 2 Vacancy</TableCell>,
            <TableCell key="m3" align="right">Month 3 Vacancy</TableCell>
        ];
    };

    const renderLocationRows = (locations: LocationData[]) => {
        if (!locations || locations.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={5} align="center">No data available</TableCell>
                </TableRow>
            );
        }

        return locations.map((location, index) => {
            const monthlyData = location.monthly_data || [];
            return (
                <TableRow 
                    key={`${location.location_name}-${index}`}
                    hover
                    onClick={() => handleLocationClick(location)}
                    style={{ cursor: 'pointer' }}
                >
                    <TableCell>{location.location_name}</TableCell>
                    {[2, 1, 0].map((monthIndex) => {
                        const monthData = monthlyData[monthIndex];
                        return (
                            <TableCell key={monthIndex} align="right">
                                {monthData ? formatVacancyRate(monthData.vacancy_index) : 'N/A'}
                            </TableCell>
                        );
                    })}
                    <TableCell align="right">
                        {formatPercent(location.trailing_3m_yoy_change)}
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Location</TableCell>
                            {getMonthHeaders()}
                            <TableCell align="right">
                                Trailing 3M YOY Change
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderLocationRows(topLocations)}
                        {bottomLocations.length > 0 && (
                            <>
                                <TableRow>
                                    <TableCell 
                                        colSpan={5} 
                                        align="center" 
                                        sx={{ backgroundColor: '#f5f5f5' }}
                                    >
                                        Lowest Change
                                    </TableCell>
                                </TableRow>
                                {renderLocationRows(bottomLocations)}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}; 