import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box, Button } from '@mui/material';
import { DataTable } from '../components/DataTable';
import { api } from '../services/api';
import { SummaryData } from '../types';
import { useNavigate } from 'react-router-dom';

export const SummaryPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await api.getSummary();
                setSummaryData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching summary data:', err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!summaryData) {
        return null;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">Rent Price Summary</Typography>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => navigate('/location/National/United States')}
                    >
                        View Location Details
                    </Button>
                </Box>
                
                <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
                    Trailing 3-Month Year-over-Year Changes
                </Typography>

                <DataTable
                    title="States"
                    topLocations={summaryData.states.top}
                    bottomLocations={summaryData.states.bottom}
                />

                <DataTable
                    title="Metropolitan Areas"
                    topLocations={summaryData.metros.top}
                    bottomLocations={summaryData.metros.bottom}
                />

                <DataTable
                    title="Cities"
                    topLocations={summaryData.cities.top}
                    bottomLocations={summaryData.cities.bottom}
                />
            </Container>
        </Box>
    );
}; 