import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import TimeOnMarketDataTable from '../../../../components/apartmentlist/time_on_market/TimeOnMarketDataTable';
import { getTimeOnMarketSummary } from '../../../../services/apartmentlist/time_on_market/api';
import type { SummaryData } from '../../../../types/apartmentlist/time_on_market/types';

const TimeOnMarketSummary: React.FC = () => {
    const navigate = useNavigate();
    const [summaryData, setSummaryData] = useState<Record<string, SummaryData>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAllSummaryData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const stateData = await getTimeOnMarketSummary('State');
                const metroData = await getTimeOnMarketSummary('Metro');
                const cityData = await getTimeOnMarketSummary('City');
                
                setSummaryData({
                    State: stateData,
                    Metro: metroData,
                    City: cityData
                });
            } catch (err) {
                setError('Error loading summary data');
                console.error('Error loading summary data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadAllSummaryData();
    }, []);

    const handleDetailsClick = () => {
        navigate('/rental-market/time-on-market/details/National/United States');
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography 
                variant="h4" 
                align="center" 
                gutterBottom
                sx={{ color: '#0AB3B0', mb: 3 }}
            >
                Time on Market Summary
            </Typography>
            
            <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    onClick={handleDetailsClick}
                    sx={{
                        backgroundColor: '#0AB3B0',
                        '&:hover': {
                            backgroundColor: '#089690'
                        }
                    }}
                >
                    View Details by Location
                </Button>
            </Box>

            <Typography 
                variant="h5" 
                align="center" 
                gutterBottom
                sx={{ mb: 4 }}
            >
                Trailing 3-Month Year-over-Year Change Top and Bottom Locations
            </Typography>

            {summaryData.State && (
                <TimeOnMarketDataTable
                    title="States with Largest and Smallest Time on Market Changes"
                    data={[...summaryData.State.data.top, ...summaryData.State.data.bottom]}
                    latestMonths={summaryData.State.metadata.latest_months}
                />
            )}

            {summaryData.Metro && (
                <TimeOnMarketDataTable
                    title="Metro Areas with Largest and Smallest Time on Market Changes"
                    data={[...summaryData.Metro.data.top, ...summaryData.Metro.data.bottom]}
                    latestMonths={summaryData.Metro.metadata.latest_months}
                />
            )}

            {summaryData.City && (
                <TimeOnMarketDataTable
                    title="Cities with Largest and Smallest Time on Market Changes"
                    data={[...summaryData.City.data.top, ...summaryData.City.data.bottom]}
                    latestMonths={summaryData.City.metadata.latest_months}
                />
            )}
        </Box>
    );
};

export default TimeOnMarketSummary; 