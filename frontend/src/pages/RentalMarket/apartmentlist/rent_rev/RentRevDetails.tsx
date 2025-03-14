import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Container, Typography, CircularProgress } from '@mui/material';
import RentRevLocationSelector from '../../../../components/apartmentlist/rent_rev/RentRevLocationSelector';
import { RentRevChart } from '../../../../components/apartmentlist/rent_rev/RentRevChart';
import { fetchRentDetails } from '../../../../services/apartmentlist/rent_rev/api';
import { LocationDetail } from '../../../../types/apartmentlist/rent_rev/types';

export const RentRevDetails: React.FC = () => {
    const navigate = useNavigate();
    const { locationType: urlLocationType, locationName: urlLocationName } = useParams<{ locationType: string; locationName: string; }>();
    const [locationType, setLocationType] = useState<string>(urlLocationType || 'National');
    const [locationName, setLocationName] = useState<string>(urlLocationName || 'United States');
    const [locationDetail, setLocationDetail] = useState<LocationDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadLocationDetail = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchRentDetails(locationType, locationName);
            setLocationDetail(data);
        } catch (error) {
            console.error('Error loading location detail:', error);
            setError('Failed to load location data');
        } finally {
            setLoading(false);
        }
    }, [locationType, locationName]);

    useEffect(() => {
        if (urlLocationType && urlLocationName) {
            setLocationType(urlLocationType);
            setLocationName(urlLocationName);
        }
    }, [urlLocationType, urlLocationName]);

    useEffect(() => {
        if (locationName && locationType) {
            loadLocationDetail();
        }
    }, [locationName, locationType, loadLocationDetail]);

    const handleLocationTypeChange = (type: string) => {
        setLocationType(type);
        // Set default location name based on type
        const defaultLocation = type === 'National' ? 'United States' : '';
        setLocationName(defaultLocation);
        if (defaultLocation) {
            navigate(`/rental/apartments-rent-rev/details/${type}/${defaultLocation}`);
        } else {
            // If no default location, stay on current page and let user select
            setError('Please select a location');
        }
    };

    const handleLocationNameChange = (name: string) => {
        setLocationName(name);
        navigate(`/rental/apartments-rent-rev/details/${locationType}/${name}`);
    };

    const handleBack = () => {
        navigate('/rental/apartments-rent-rev');
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ 
                    color: '#0AB3B0',
                    mb: 2,
                    fontWeight: 'bold'
                }}>
                    Apartments Rent Estimates by Location
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleBack}
                    sx={{
                        backgroundColor: '#0AB3B0',
                        mb: 3,
                        '&:hover': {
                            backgroundColor: '#006D6B'
                        }
                    }}
                >
                    Back to Summary
                </Button>
            </Box>

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                <RentRevLocationSelector
                    selectedLocationType={locationType}
                    selectedLocationName={locationName}
                    onLocationTypeChange={handleLocationTypeChange}
                    onLocationNameChange={handleLocationNameChange}
                />
            </Box>

            {locationName && (
                <Typography
                    variant="h5"
                    component="h2"
                    textAlign="center"
                    mb={3}
                >
                    {`${locationType}: ${locationName}`}
                </Typography>
            )}

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Box sx={{ textAlign: 'center', color: 'error.main', my: 4 }}>
                    <Typography>{error}</Typography>
                </Box>
            )}

            {locationDetail && locationDetail.data && (
                <Box sx={{ mt: 4 }}>
                    <RentRevChart
                        title="Overall Rent Estimates"
                        timeSeriesData={locationDetail.data}
                        rentType="rent_estimate"
                    />
                    <RentRevChart
                        title="1 Bedroom Rent Estimates"
                        timeSeriesData={locationDetail.data}
                        rentType="rent_estimate_1br"
                    />
                    <RentRevChart
                        title="2 Bedroom Rent Estimates"
                        timeSeriesData={locationDetail.data}
                        rentType="rent_estimate_2br"
                    />
                </Box>
            )}
        </Container>
    );
}; 