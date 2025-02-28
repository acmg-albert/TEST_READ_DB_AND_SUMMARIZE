import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { VacancyLocationSelector } from '../../../../components/apartmentlist/vacancy/VacancyLocationSelector';
import { VacancyChart } from '../../../../components/apartmentlist/vacancy/VacancyChart';
import { api } from '../../../../services/apartmentlist/vacancy/api';
import { LocationData } from '../../../../types/apartmentlist/vacancy/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const VacancyDetails: React.FC = () => {
    const navigate = useNavigate();
    const { type: urlType, name: urlName } = useParams();
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (urlType && urlName) {
            fetchLocationData(urlType, urlName);
        }
    }, [urlType, urlName]);

    const fetchLocationData = async (locationType: string, locationName: string) => {
        try {
            const data = await api.getLocationDetails(locationType, locationName);
            setLocationData(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch location data');
            console.error('Error fetching location data:', err);
        }
    };

    const handleLocationChange = (newType: string, newName: string) => {
        navigate(`/rental/apartments-vacancy/details/${newType}/${newName}`);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container maxWidth="lg">
            {/* 页面标题 */}
            <Typography 
                variant="h4" 
                component="h1" 
                align="center" 
                sx={{ 
                    mt: 4,
                    mb: 3,
                    color: '#0AB3B0',
                    fontWeight: 500
                }}
            >
                Apartments Vacancy Trend by Location
            </Typography>

            {/* 返回按钮 */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    mb: 4
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/rental/apartments-vacancy')}
                    sx={{
                        backgroundColor: '#0AB3B0',
                        mb: 4,
                        '&:hover': {
                            backgroundColor: '#006D6B'
                        }
                    }}
                >
                    Back to Summary
                </Button>
            </Box>

            <Box sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <VacancyLocationSelector
                        onLocationChange={handleLocationChange}
                        initialLocationType={urlType}
                        initialLocationName={urlName}
                    />
                </Box>

                {locationData?.location_name && (
                    <Typography 
                        variant="h5" 
                        align="center" 
                        sx={{ 
                            mb: 3,
                            color: '#666565',
                            fontWeight: 500
                        }}
                    >
                        {locationData.location_name} ({locationData.location_type})
                    </Typography>
                )}

                {locationData?.time_series && (
                    <VacancyChart
                        title="Vacancy Rate Trends"
                        timeSeriesData={locationData.time_series}
                    />
                )}
            </Box>
        </Container>
    ); 
}; 