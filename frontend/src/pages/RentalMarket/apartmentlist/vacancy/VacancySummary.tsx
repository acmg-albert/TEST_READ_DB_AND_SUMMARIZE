import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, CircularProgress } from '@mui/material';
import { VacancyDataTable } from '../../../../components/apartmentlist/vacancy/VacancyDataTable';
import { api } from '../../../../services/apartmentlist/vacancy/api';
import { SummaryData } from '../../../../types/apartmentlist/vacancy/types';

export const VacancySummary: React.FC = () => {
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await api.getSummary();
            setSummaryData(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching summary data:', err);
            setError('Failed to load vacancy data');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '60vh' 
            }}>
                <CircularProgress sx={{ color: '#0AB3B0' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ 
                    color: '#0AB3B0',
                    mb: 2,
                    fontWeight: 'bold'
                }}>
                    Apartments Vacancy Rate Summary
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/rental/apartments-vacancy/details/National/United States')}
                    sx={{
                        backgroundColor: '#0AB3B0',
                        mb: 3,
                        '&:hover': {
                            backgroundColor: '#006D6B'
                        }
                    }}
                >
                    View Details by Location
                </Button>
                <Typography variant="h5" sx={{ 
                    mb: 3,
                    fontWeight: 'bold'
                }}>
                    Trailing 3-Month Year-over-Year Change Top and Bottom Locations
                </Typography>
            </Box>

            {summaryData && (
                <>
                    <VacancyDataTable
                        title="States with Highest and Lowest Vacancy Rate Changes"
                        topLocations={summaryData.states.top}
                        bottomLocations={summaryData.states.bottom}
                        locationType="State"
                    />
                    <VacancyDataTable
                        title="Metro Areas with Highest and Lowest Vacancy Rate Changes"
                        topLocations={summaryData.metros.top}
                        bottomLocations={summaryData.metros.bottom}
                        locationType="Metro"
                    />
                    <VacancyDataTable
                        title="Cities with Highest and Lowest Vacancy Rate Changes"
                        topLocations={summaryData.cities.top}
                        bottomLocations={summaryData.cities.bottom}
                        locationType="City"
                    />
                </>
            )}
        </Container>
    );
}; 