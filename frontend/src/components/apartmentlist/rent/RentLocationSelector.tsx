import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Box, useTheme, useMediaQuery } from '@mui/material';
import { api } from '../../../services/apartmentlist/rent/api';

interface LocationOption {
    location_type: string;
    location_name: string;
}

interface RentLocationSelectorProps {
    onLocationChange: (locationType: string, locationName: string) => void;
    initialLocationType?: string;
    initialLocationName?: string;
}

export const RentLocationSelector: React.FC<RentLocationSelectorProps> = ({
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocationTypes = async () => {
            try {
                const types = await api.getLocationTypes();
                setLocationTypes(types);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching location types:', error);
                setLoading(false);
            }
        };

        fetchLocationTypes();
    }, []);

    useEffect(() => {
        const fetchLocations = async () => {
            if (!selectedType) return;

            try {
                setLoading(true);
                const locationData = await api.getLocationsByType(selectedType);
                setLocations(locationData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching locations:', error);
                setLoading(false);
            }
        };

        fetchLocations();
    }, [selectedType]);

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
                    <TextField
                        {...params}
                        label="Location Type"
                        variant="outlined"
                    />
                )}
                disabled={loading}
                isOptionEqualToValue={(option, value) => option === value}
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
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Location"
                        variant="outlined"
                    />
                )}
                disabled={!selectedType || loading}
                isOptionEqualToValue={(option, value) => 
                    option.location_name === value.location_name && 
                    option.location_type === value.location_type
                }
            />
        </Box>
    );
};