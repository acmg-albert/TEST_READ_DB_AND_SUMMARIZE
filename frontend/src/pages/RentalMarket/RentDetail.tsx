import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress, Box, Button } from '@mui/material';
import { LocationSelector } from '../../components/LocationSelector';
import { RentChart } from '../../components/RentChart';
import { api } from '../../services/api';
import { LocationData } from '../../types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const LocationDetailPage: React.FC = () => {
    const { locationType, locationName } = useParams<{ locationType: string; locationName: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const navigate = useNavigate();

    const fetchLocationData = async (type: string, name: string) => {
        try {
            setLoading(true);
            const data = await api.getLocationDetails(type, name);
            if (data.error) {
                setError(data.error);
                setLocationData(null);
            } else {
                setLocationData(data);
                setError(null);
            }
        } catch (err: any) {
            console.error('Error fetching location data:', err);
            setError(err.response?.data?.detail || 'Failed to load location data. Please try again later.');
            setLocationData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (locationType && locationName) {
            fetchLocationData(locationType, locationName);
        }
    }, [locationType, locationName]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={3}>
                <Typography color="error" variant="h6" align="center">
                    {error}
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/rental/apartments-rent')}
                    startIcon={<ArrowBackIcon />}
                >
                    Back to Summary
                </Button>
            </Box>
        );
    }

    if (!locationData || !locationData.time_series) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={3}>
                <Typography variant="h6" align="center">
                    No rent data available for this location
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/rental/apartments-rent')}
                    startIcon={<ArrowBackIcon />}
                >
                    Back to Summary
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/rental/apartments-rent')}
                            variant="contained"
                            color="primary"
                        >
                            Back to Summary
                        </Button>
                        <Typography variant="h4" component="h1">
                            Location Details
                        </Typography>
                    </Box>
                </Box>

                <LocationSelector
                    initialLocationType={locationType || 'National'}
                    initialLocationName={locationName || 'United States'}
                    onLocationChange={(type, name) => {
                        navigate(`/rental/apartments-rent/${type}/${name}`);
                    }}
                />

                {locationData && (
                    <>
                        <Typography 
                            variant="h4" 
                            gutterBottom 
                            align="center"
                            sx={{ 
                                fontWeight: 'bold',
                                mb: 3
                            }}
                        >
                            {locationData.location_name} ({locationType})
                        </Typography>

                        <RentChart
                            title="Overall Rent Trends"
                            timeSeriesData={locationData.time_series}
                            rentType="overall"
                        />

                        <RentChart
                            title="1 Bedroom Rent Trends"
                            timeSeriesData={locationData.time_series}
                            rentType="1br"
                        />

                        <RentChart
                            title="2 Bedroom Rent Trends"
                            timeSeriesData={locationData.time_series}
                            rentType="2br"
                        />
                    </>
                )}
            </Container>
        </Box>
    );
}; 