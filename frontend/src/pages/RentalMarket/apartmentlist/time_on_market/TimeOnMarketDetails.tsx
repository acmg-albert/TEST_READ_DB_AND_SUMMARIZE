import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TimeOnMarketChart from '../../../../components/apartmentlist/time_on_market/TimeOnMarketChart';
import TimeOnMarketLocationSelector from '../../../../components/apartmentlist/time_on_market/TimeOnMarketLocationSelector';
import { getTimeOnMarketDetails } from '../../../../services/apartmentlist/time_on_market/api';
import { LocationDetail } from '../../../../types/apartmentlist/time_on_market/types';

const TimeOnMarketDetails: React.FC = () => {
    const { locationType: urlLocationType, locationName: urlLocationName } = useParams<{
        locationType: string;
        locationName: string;
    }>();
    const navigate = useNavigate();
    const [locationType, setLocationType] = useState<string>(urlLocationType || 'National');
    const [locationName, setLocationName] = useState<string>(urlLocationName || 'United States');
    const [detailData, setDetailData] = useState<LocationDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (urlLocationType && urlLocationName) {
            setLocationType(urlLocationType);
            setLocationName(urlLocationName);
        }
    }, [urlLocationType, urlLocationName]);

    useEffect(() => {
        if (locationName && locationType) {
            fetchDetailData(locationType, locationName);
        }
    }, [locationName, locationType]);

    const fetchDetailData = async (type: string, name: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTimeOnMarketDetails(type, name);
            setDetailData(data);
        } catch (err) {
            setError('Error loading data');
            console.error('Error fetching detail data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationTypeChange = (type: string) => {
        setLocationType(type);
        // Set default location name based on type
        const defaultLocation = type === 'National' ? 'United States' : '';
        setLocationName(defaultLocation);
        if (defaultLocation) {
            navigate(`/rental-market/time-on-market/details/${type}/${defaultLocation}`);
        } else {
            // If no default location, stay on current page and let user select
            setError('Please select a location');
        }
    };

    const handleLocationNameChange = (name: string) => {
        if (name) {
            setLocationName(name);
            navigate(`/rental-market/time-on-market/details/${locationType}/${name}`);
        }
    };

    const handleBack = () => {
        navigate('/rental-market/time-on-market');
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ 
                        color: '#0AB3B0',
                        mb: 2,
                        fontWeight: 'bold'
                    }}
                >
                    Apartments Time on Market by Location
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

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start' }}>
                <TimeOnMarketLocationSelector
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

            {error && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress sx={{ color: '#0AB3B0' }} />
                </Box>
            )}

            {detailData && !loading && (
                <Box sx={{ mt: 4 }}>
                    <TimeOnMarketChart
                        timeSeriesData={detailData.data}
                        title="Time on Market Trend"
                    />
                    <Typography variant="body2" color="textSecondary" align="right">
                        Data Version: {detailData.metadata.data_version}
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default TimeOnMarketDetails; 