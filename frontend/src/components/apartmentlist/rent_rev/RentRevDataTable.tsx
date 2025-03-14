import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Link,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocationData } from '../../../types/apartmentlist/rent_rev/types';

interface RentRevDataTableProps {
    title: string;
    category: string;
    topLocations: LocationData[];
    bottomLocations: LocationData[];
    locationType: string;
}

const RentRevDataTable: React.FC<RentRevDataTableProps> = ({
    title,
    category,
    topLocations = [],
    bottomLocations = [],
    locationType
}) => {
    const navigate = useNavigate();

    const handleLocationClick = (location: LocationData) => {
        navigate(`/rental/apartments-rent-rev/details/${locationType}/${location.location_name}`);
    };

    const formatPercent = (value: number | undefined) => {
        if (typeof value !== 'number') return 'N/A';
        return `${value.toFixed(1)}%`;
    };

    const formatRent = (value: number | undefined) => {
        if (typeof value !== 'number') return 'N/A';
        return `$${value.toLocaleString()}`;
    };

    const renderLocationRows = (locations: LocationData[]) => {
        return locations.map((location, index) => (
            <TableRow key={`${location.location_name}-${index}`}>
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
                <TableCell align="right">{formatRent(location.month1_rent_estimate)}</TableCell>
                <TableCell align="right">{formatRent(location.month2_rent_estimate)}</TableCell>
                <TableCell align="right">{formatRent(location.month3_rent_estimate)}</TableCell>
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
                                {topLocations[0]?.month1_year_month?.replace('_', '-') || 'Month 1'} Rent
                            </TableCell>
                            <TableCell align="right">
                                {topLocations[0]?.month2_year_month?.replace('_', '-') || 'Month 2'} Rent
                            </TableCell>
                            <TableCell align="right">
                                {topLocations[0]?.month3_year_month?.replace('_', '-') || 'Month 3'} Rent
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

export default RentRevDataTable; 