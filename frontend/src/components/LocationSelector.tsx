import React, { useEffect, useState } from 'react';
import { 
    Box,
    Autocomplete,
    TextField,
    CircularProgress,
    Alert
} from '@mui/material';
import { api } from '../services/api';

interface LocationOption {
    location_type: string;
    location_name: string;
}

interface LocationSelectorProps {
    onLocationChange: (locationType: string, locationName: string) => void;
    initialLocationType?: string;
    initialLocationName?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
    onLocationChange,
    initialLocationType = 'National',
    initialLocationName = 'United States'
}) => {
    const [locationTypes, setLocationTypes] = useState<string[]>([]);
    const [locations, setLocations] = useState<LocationOption[]>([]);
    const [selectedType, setSelectedType] = useState<string>(initialLocationType);
    const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocationTypes = async () => {
            try {
                setLoading(true);
                const types = await api.getLocationTypes();
                setLocationTypes(types);
                setError(null);
            } catch (error) {
                console.error('Error fetching location types:', error);
                setError('获取位置类型失败');
            } finally {
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
                const locationList = await api.getLocationsByType(selectedType);
                setLocations(locationList);
                setError(null);

                if (initialLocationName && selectedType === initialLocationType) {
                    const initialLocation = locationList.find(
                        (loc) => loc.location_name === initialLocationName
                    );
                    if (initialLocation) {
                        setSelectedLocation(initialLocation);
                    }
                }
            } catch (error) {
                console.error('Error fetching locations:', error);
                setError('获取位置列表失败');
                setLocations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, [selectedType, initialLocationName, initialLocationType]);

    const handleTypeChange = (_event: any, newType: string | null) => {
        if (newType) {
            setSelectedType(newType);
            setSelectedLocation(null);
            setError(null);
        }
    };

    const handleLocationChange = (_event: any, newLocation: LocationOption | null) => {
        setSelectedLocation(newLocation);
        if (newLocation) {
            onLocationChange(selectedType, newLocation.location_name);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Autocomplete
                    value={selectedType}
                    onChange={handleTypeChange}
                    options={locationTypes}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Location Type"
                            variant="outlined"
                            error={!!error}
                        />
                    )}
                    sx={{ minWidth: 200 }}
                    disabled={loading && !locationTypes.length}
                />

                <Autocomplete
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    options={locations}
                    getOptionLabel={(option: LocationOption) => option.location_name}
                    isOptionEqualToValue={(option, value) => 
                        option.location_name === value.location_name
                    }
                    renderOption={(props, option) => (
                        <li {...props} key={`${option.location_type}-${option.location_name}`}>
                            {option.location_name}
                        </li>
                    )}
                    loading={loading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Location"
                            variant="outlined"
                            error={!!error}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                    sx={{ minWidth: 300 }}
                    disabled={!selectedType || loading}
                />
            </Box>
        </Box>
    );
};