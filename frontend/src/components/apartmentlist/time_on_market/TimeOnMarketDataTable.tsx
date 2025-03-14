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
import { LocationData } from '../../../types/apartmentlist/time_on_market/types';

interface TimeOnMarketDataTableProps {
    title: string;
    data: LocationData[];
    latestMonths: string[];
}

const TimeOnMarketDataTable: React.FC<TimeOnMarketDataTableProps> = ({
    title,
    data = []
}) => {
    const navigate = useNavigate();
    const topLocations = data.slice(0, data.length / 2);
    const bottomLocations = data.slice(data.length / 2);

    const handleLocationClick = (location: LocationData) => {
        navigate(`/rental-market/time-on-market/details/${location.location_type}/${encodeURIComponent(location.location_name)}`);
    };

    const formatDays = (value: number | undefined) => {
        if (value === undefined) return 'N/A';
        return `${value.toFixed(1)} days`;
    };

    const formatPercent = (value: number | undefined) => {
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
                <TableCell align="right">{formatDays(location.month1_time_on_market)}</TableCell>
                <TableCell align="right">{formatDays(location.month2_time_on_market)}</TableCell>
                <TableCell align="right">{formatDays(location.month3_time_on_market)}</TableCell>
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
                                {topLocations[0]?.month1_year_month?.replace('_', '-') || 'Month 1'} Time on Market
                            </TableCell>
                            <TableCell align="right">
                                {topLocations[0]?.month2_year_month?.replace('_', '-') || 'Month 2'} Time on Market
                            </TableCell>
                            <TableCell align="right">
                                {topLocations[0]?.month3_year_month?.replace('_', '-') || 'Month 3'} Time on Market
                            </TableCell>
                            <TableCell align="right">YoY Change</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Typography variant="subtitle2" sx={{ ml: 2 }}>
                                    {`Top ${title.includes('States') ? 'States' : 
                                        title.includes('Metro') ? 'Metros' : 
                                        'Cities'}`}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        {renderLocationRows(topLocations)}
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Typography variant="subtitle2" sx={{ ml: 2 }}>
                                    {`Bottom ${title.includes('States') ? 'States' : 
                                        title.includes('Metro') ? 'Metros' : 
                                        'Cities'}`}
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

export default TimeOnMarketDataTable; 