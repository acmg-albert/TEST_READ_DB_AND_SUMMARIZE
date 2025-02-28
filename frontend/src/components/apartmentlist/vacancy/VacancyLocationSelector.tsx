import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Box, useTheme, useMediaQuery } from '@mui/material';
import { api, LocationOption } from '../../../services/apartmentlist/vacancy/api';

interface VacancyLocationSelectorProps {
    onLocationChange: (locationType: string, locationName: string) => void;
    initialLocationType?: string;
    initialLocationName?: string;
}

export const VacancyLocationSelector: React.FC<VacancyLocationSelectorProps> = ({
    onLocationChange,
    initialLocationType = 'National',
    initialLocationName = 'United States'
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [locationTypes, setLocationTypes] = useState<string[]>([]);
    const [locations, setLocations] = useState<LocationOption[]>([]);
    const [selectedType, setSelectedType] = useState<string | null>(initialLocationType);
    const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>({
        location_type: initialLocationType,
        location_name: initialLocationName
    });

    useEffect(() => {
        fetchLocationTypes();
    }, []);

    useEffect(() => {
        if (selectedType) {
            fetchLocations();
        }
    }, [selectedType]);

    const fetchLocationTypes = async () => {
        try {
            const types = await api.getLocationTypes();
            setLocationTypes(types);
        } catch (error) {
            console.error('Error fetching location types:', error);
        }
    };

    const fetchLocations = async () => {
        if (!selectedType) return;
        try {
            const locationsList = await api.getLocationsByType(selectedType);
            setLocations(locationsList);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const handleTypeChange = (_event: any, newType: string | null) => {
        setSelectedType(newType);
        setSelectedLocation(null);
    };

    const handleLocationChange = (_event: any, newLocation: LocationOption | null) => {
        setSelectedLocation(newLocation);
        if (newLocation && selectedType) {
            onLocationChange(selectedType, newLocation.location_name);
        }
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
            width: '100%',
            alignItems: 'center',
            padding: isMobile ? '0 20px' : 0,
            mb: 3
        }}>
            <Autocomplete
                value={selectedType}
                onChange={handleTypeChange}
                options={locationTypes}
                sx={{ 
                    minWidth: isMobile ? '100%' : 200,
                    '& .MuiOutlinedInput-root': {
                        fontSize: isMobile ? '0.875rem' : '1rem'
                    }
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Location Type" variant="outlined" />
                )}
            />
            <Autocomplete
                value={selectedLocation}
                onChange={handleLocationChange}
                options={locations}
                sx={{ 
                    minWidth: isMobile ? '100%' : 300,
                    '& .MuiOutlinedInput-root': {
                        fontSize: isMobile ? '0.875rem' : '1rem'
                    }
                }}
                getOptionLabel={(option) => option.location_name}
                isOptionEqualToValue={(option, value) => 
                    option.location_type === value.location_type && 
                    option.location_name === value.location_name
                }
                renderInput={(params) => (
                    <TextField {...params} label="Location" variant="outlined" />
                )}
            />
        </Box>
    );
}; 