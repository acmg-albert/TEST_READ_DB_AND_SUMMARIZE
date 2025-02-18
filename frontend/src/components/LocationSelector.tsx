import React, { useEffect, useState } from 'react';
import { 
    Box,
    Autocomplete,
    TextField,
    CircularProgress
} from '@mui/material';
import { api } from '../services/api';

interface LocationSelectorProps {
    onLocationChange: (locationType: string, locationName: string) => void;
    initialLocationType?: string;
    initialLocationName?: string;
}

interface LocationOption {
    location_type: string;
    location_name: string;
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

    useEffect(() => {
        setSelectedType(initialLocationType);
    }, [initialLocationType]);

    useEffect(() => {
        const fetchLocationTypes = async () => {
            try {
                const types = await api.getLocationTypes();
                setLocationTypes(types);
            } catch (error) {
                console.error('Error fetching location types:', error);
            }
        };
        fetchLocationTypes();
    }, []);

    useEffect(() => {
        const fetchLocations = async () => {
            if (selectedType) {
                setLoading(true);
                try {
                    const locationList = await api.getLocations(selectedType);
                    setLocations(locationList);
                    
                    if (initialLocationName) {
                        const initialLocation = locationList.find(
                            loc => loc.location_name === initialLocationName
                        );
                        if (initialLocation) {
                            setSelectedLocation(initialLocation);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching locations:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchLocations();
    }, [selectedType, initialLocationName]);

    const handleTypeChange = (_event: any, newType: string | null) => {
        if (newType) {
            setSelectedType(newType);
            setSelectedLocation(null);
        }
    };

    const handleLocationChange = (_event: any, newLocation: LocationOption | null) => {
        setSelectedLocation(newLocation);
        if (newLocation) {
            onLocationChange(selectedType, newLocation.location_name);
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Autocomplete
                value={selectedType}
                onChange={handleTypeChange}
                options={locationTypes}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Location Type"
                        variant="outlined"
                    />
                )}
                sx={{ minWidth: 200 }}
            />

            <Autocomplete
                value={selectedLocation}
                onChange={handleLocationChange}
                options={locations}
                getOptionLabel={(option) => option.location_name}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Location"
                        variant="outlined"
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
                disabled={!selectedType}
            />
        </Box>
    );
}; 