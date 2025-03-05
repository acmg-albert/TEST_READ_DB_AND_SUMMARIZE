import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import VacancyRevLocationSelector from '../../../../components/apartmentlist/vacancy_rev/VacancyRevLocationSelector';
import { VacancyRevChart } from '../../../../components/apartmentlist/vacancy_rev/VacancyRevChart';
import { fetchVacancyDetails } from '../../../../services/apartmentlist/vacancy_rev/api';
import { LocationDetail } from '../../../../types/apartmentlist/vacancy_rev/types';

export const VacancyDetails: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const urlParams = new URLSearchParams(window.location.search);
    const [locationType, setLocationType] = useState(decodeURIComponent(window.location.pathname.split('/')[4] || 'National'));
    const [locationName, setLocationName] = useState(decodeURIComponent(window.location.pathname.split('/')[5] || 'United States'));
    const [locationDetail, setLocationDetail] = useState<LocationDetail | null>(null);

    // 加载位置详情数据
    const loadLocationDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const details = await fetchVacancyDetails(locationType, locationName);
            setLocationDetail(details);
        } catch (error) {
            console.error('Error fetching location details:', error);
            setError('加载位置详情数据时出错');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (locationName && locationType) {
            loadLocationDetail();
        }
    }, [locationName, locationType]);

    // 处理位置类型变化
    const handleLocationTypeChange = (type: string) => {
        setLocationType(type);
        // 重置位置名称，避免使用可能在新类型中不存在的名称
        if (type === 'National') {
            setLocationName('United States');
        } else {
            setLocationName('');
        }
    };

    // 处理位置名称变化
    const handleLocationNameChange = (name: string) => {
        setLocationName(name);
    };

    // 返回按钮处理
    const handleBack = () => {
        navigate('/rental/apartments-vacancy-rev');
    };

    return (
        <Box className="container-fluid bg-white p-0">
            <Box 
                className="container-fluid header bg-white p-0"
                display="flex"
                flexDirection="column"
                alignItems="center"
                mt={4}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    textAlign="center"
                    color="#0AB3B0"
                    mb={2}
                >
                    Apartments Vacancy Rate Details
                </Typography>
                
                <Button
                    variant="contained"
                    onClick={handleBack}
                    sx={{
                        backgroundColor: '#0AB3B0',
                        color: 'white',
                        mb: 3,
                        '&:hover': {
                            backgroundColor: '#098F8C'
                        }
                    }}
                >
                    Return to Summary
                </Button>
            </Box>

            <Box className="container-xxl py-5">
                <Box mb={4}>
                    <VacancyRevLocationSelector
                        selectedLocationType={locationType}
                        selectedLocationName={locationName}
                        onLocationTypeChange={handleLocationTypeChange}
                        onLocationNameChange={handleLocationNameChange}
                    />
                </Box>

                {loading && (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 4 }}>
                        {error}
                    </Alert>
                )}

                {locationDetail && !loading && !error && (
                    <Box>
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
                        <VacancyRevChart
                            title="Vacancy Rate and YoY Change"
                            timeSeriesData={locationDetail.data}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default VacancyDetails;