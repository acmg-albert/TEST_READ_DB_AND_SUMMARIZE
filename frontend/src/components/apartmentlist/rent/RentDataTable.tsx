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
    Link
} from '@mui/material';
import { LocationData } from '../../../types/apartmentlist/rent/types';
import { useNavigate } from 'react-router-dom';

interface RentDataTableProps {
    title: string;
    topLocations: LocationData[];
    bottomLocations: LocationData[];
    locationType: string;
}

export const RentDataTable: React.FC<RentDataTableProps> = ({ title, topLocations, bottomLocations, locationType }) => {
    const navigate = useNavigate();

    const handleLocationClick = (location: LocationData) => {
        navigate(`/rental/apartments-rent/${locationType}/${location.location_name}`);
    };

    const formatPercent = (value: number | undefined) => {
        if (typeof value !== 'number') return 'N/A';
        return `${value.toFixed(2)}%`;
    };

    const formatPrice = (value: number | undefined) => {
        if (typeof value !== 'number') return 'N/A';
        return `$${value.toLocaleString()}`;
    };

    const renderLocationRows = (locations: LocationData[]) => {
        return locations.map((location) => {
            const latestData = location.monthly_data?.[0] ?? {
                overall: 0,
                '1br': 0,
                '2br': 0
            };
            
            return (
                <TableRow key={location.location_name}>
                    <TableCell>
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => handleLocationClick(location)}
                        >
                            {location.location_name}
                        </Link>
                    </TableCell>
                    <TableCell align="right">{formatPercent(location.trailing_3m_yoy_change)}</TableCell>
                    <TableCell align="right">{formatPrice(latestData.overall)}</TableCell>
                    <TableCell align="right">{formatPrice(latestData['1br'])}</TableCell>
                    <TableCell align="right">{formatPrice(latestData['2br'])}</TableCell>
                </TableRow>
            );
        });
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Location</TableCell>
                            <TableCell align="right">3-Month YoY Change</TableCell>
                            <TableCell align="right">Overall Rent</TableCell>
                            <TableCell align="right">1BR Rent</TableCell>
                            <TableCell align="right">2BR Rent</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Typography variant="subtitle2" style={{ marginLeft: '1rem' }}>
                                    Top Performers
                                </Typography>
                            </TableCell>
                        </TableRow>
                        {renderLocationRows(topLocations)}
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Typography variant="subtitle2" style={{ marginLeft: '1rem' }}>
                                    Bottom Performers
                                </Typography>
                            </TableCell>
                        </TableRow>
                        {renderLocationRows(bottomLocations)}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}; 