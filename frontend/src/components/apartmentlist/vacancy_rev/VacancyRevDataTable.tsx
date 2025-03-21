import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    Link
} from '@mui/material';
import { LocationData } from '../../../types/apartmentlist/vacancy_rev/types';

interface VacancyRevDataTableProps {
    title: string;
    category: string;
    topLocations: LocationData[];
    bottomLocations: LocationData[];
    locationType: string;
}

const VacancyRevDataTable: React.FC<VacancyRevDataTableProps> = ({
    title,
    category,
    topLocations = [],
    bottomLocations = [],
    locationType
}) => {
    const navigate = useNavigate();

    const handleLocationClick = (location: LocationData) => {
        navigate(`/rental/apartments-vacancy-rev/details/${location.location_type}/${encodeURIComponent(location.location_name)}`);
    };

    const formatPercent = (value: number | undefined) => {
        if (value === undefined) return 'N/A';
        return `${value.toFixed(2)}%`;
    };

    const formatVacancyRate = (value: number | undefined) => {
        if (value === undefined) return 'N/A';
        return `${value.toFixed(2)}%`;
    };

    const renderLocationRows = (locations: LocationData[]) => {
        return locations.map((location, index) => (
            <TableRow
                key={`${location.location_name}-${index}`}
            >
                <TableCell>
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => handleLocationClick(location)}
                        sx={{ textDecoration: 'none' }}
                    >
                        {location.location_name}
                    </Link>
                </TableCell>
                <TableCell align="right">{formatVacancyRate(location.month1_vacancy)}</TableCell>
                <TableCell align="right">{formatVacancyRate(location.month2_vacancy)}</TableCell>
                <TableCell align="right">{formatVacancyRate(location.month3_vacancy)}</TableCell>
                <TableCell align="right">{formatPercent(location.yoy_change)}</TableCell>
            </TableRow>
        ));
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Location</TableCell>
                            <TableCell align="right">
                                {topLocations[0]?.month1_year_month?.replace('_', '-') || 'Month 1'} Vacancy
                            </TableCell>
                            <TableCell align="right">
                                {topLocations[0]?.month2_year_month?.replace('_', '-') || 'Month 2'} Vacancy
                            </TableCell>
                            <TableCell align="right">
                                {topLocations[0]?.month3_year_month?.replace('_', '-') || 'Month 3'} Vacancy
                            </TableCell>
                            <TableCell align="right">YoY Change</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Typography variant="subtitle2" sx={{ ml: 2 }}>
                                    Top {category}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        {renderLocationRows(topLocations)}
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Typography variant="subtitle2" sx={{ ml: 2 }}>
                                    Bottom {category}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        {renderLocationRows(bottomLocations)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default VacancyRevDataTable; 