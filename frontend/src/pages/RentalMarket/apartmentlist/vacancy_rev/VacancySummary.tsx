import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import VacancyRevDataTable from '../../../../components/apartmentlist/vacancy_rev/VacancyRevDataTable';
import { fetchVacancySummary } from '../../../../services/apartmentlist/vacancy_rev/api';
import type { SummaryData } from '../../../../types/apartmentlist/vacancy_rev/types';

export const VacancySummary: React.FC = () => {
    const navigate = useNavigate();
    const [summaryData, setSummaryData] = useState<Record<string, SummaryData>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAllSummaryData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const stateData = await fetchVacancySummary('State');
                const metroData = await fetchVacancySummary('Metro');
                const cityData = await fetchVacancySummary('City');
                
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
        navigate('/rental/apartments-vacancy-rev/details/National/United States');
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
                Apartments Vacancy Rate Summary
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
                <VacancyRevDataTable
                    title="States with Largest and Smallest Vacancy Changes"
                    category="States"
                    topLocations={summaryData.State.data.top.slice(0, 3)}
                    bottomLocations={summaryData.State.data.bottom.slice(0, 3)}
                    locationType="State"
                />
            )}

            {summaryData.Metro && (
                <VacancyRevDataTable
                    title="Metro Areas with Largest and Smallest Vacancy Changes"
                    category="Metros"
                    topLocations={summaryData.Metro.data.top.slice(0, 3)}
                    bottomLocations={summaryData.Metro.data.bottom.slice(0, 3)}
                    locationType="Metro"
                />
            )}

            {summaryData.City && (
                <VacancyRevDataTable
                    title="Cities with Largest and Smallest Vacancy Changes"
                    category="Cities"
                    topLocations={summaryData.City.data.top.slice(0, 3)}
                    bottomLocations={summaryData.City.data.bottom.slice(0, 3)}
                    locationType="City"
                />
            )}
        </Box>
    );
};

export default VacancySummary; 