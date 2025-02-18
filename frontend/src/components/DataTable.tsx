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
import { LocationData } from '../types';
import { useNavigate } from 'react-router-dom';

interface DataTableProps {
    title: string;
    topLocations: LocationData[];
    bottomLocations: LocationData[];
}

export const DataTable: React.FC<DataTableProps> = ({ title, topLocations, bottomLocations }) => {
    const navigate = useNavigate();

    const handleLocationClick = (location: LocationData) => {
        navigate(`/location/${location.location_type}/${location.location_name}`);
    };

    const formatPercent = (value: number) => {
        return `${value.toFixed(2)}%`;
    };

    const formatPrice = (value: number) => {
        return `$${value.toLocaleString()}`;
    };

    const renderLocationRows = (locations: LocationData[]) => {
        return locations.map((location) => {
            const latestData = location.monthly_data[0];
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
                            <TableCell align="right">3M YoY Change</TableCell>
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