import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, CircularProgress } from '@mui/material';
import RentRevDataTable from '../../../../components/apartmentlist/rent_rev/RentRevDataTable';
import { fetchRentSummary } from '../../../../services/apartmentlist/rent_rev/api';
import { SummaryData } from '../../../../types/apartmentlist/rent_rev/types';

export const RentRevSummary: React.FC = () => {
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadAllSummaryData();
    }, []);

    const loadAllSummaryData = async () => {
        try {
            setLoading(true);
            const stateData = await fetchRentSummary('State');
            const metroData = await fetchRentSummary('Metro');
            const cityData = await fetchRentSummary('City');

            if (stateData.data && metroData.data && cityData.data) {
                setSummaryData({
                    states: {
                        top: stateData.data.top,
                        bottom: stateData.data.bottom
                    },
                    metros: {
                        top: metroData.data.top,
                        bottom: metroData.data.bottom
                    },
                    cities: {
                        top: cityData.data.top,
                        bottom: cityData.data.bottom
                    }
                });
                setError(null);
            } else {
                setError('Invalid data format received from server');
            }
        } catch (err) {
            console.error('Error fetching summary data:', err);
            setError('Failed to load rent data');
        } finally {
            setLoading(false);
        }
    };

    const handleDetailsClick = () => {
        navigate('/rental/apartments-rent-rev/details/National/United States');
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '60vh' 
            }}>
                <CircularProgress sx={{ color: '#4CC9C0' }} />
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
                    Apartments Rent Estimates Summary
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleDetailsClick}
                    sx={{
                        backgroundColor: '#0AB3B0',
                        mb: 4,
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
                    <RentRevDataTable
                        title="States with Highest and Lowest Rent Changes"
                        category="States"
                        topLocations={summaryData.states.top}
                        bottomLocations={summaryData.states.bottom}
                        locationType="State"
                    />
                    <RentRevDataTable
                        title="Metro Areas with Highest and Lowest Rent Changes"
                        category="Metros"
                        topLocations={summaryData.metros.top}
                        bottomLocations={summaryData.metros.bottom}
                        locationType="Metro"
                    />
                    <RentRevDataTable
                        title="Cities with Highest and Lowest Rent Changes"
                        category="Cities"
                        topLocations={summaryData.cities.top}
                        bottomLocations={summaryData.cities.bottom}
                        locationType="City"
                    />
                </>
            )}
        </Container>
    );
}; 