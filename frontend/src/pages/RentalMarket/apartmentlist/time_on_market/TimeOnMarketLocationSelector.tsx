import React, { useEffect, useState, useCallback } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Autocomplete,
    TextField,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { getLocationTypes, getLocations } from '../../../../services/apartmentlist/time_on_market/api';

interface TimeOnMarketLocationSelectorProps {
    selectedLocationType: string;
    selectedLocationName: string;
    onLocationTypeChange: (type: string) => void;
    onLocationNameChange: (name: string) => void;
    hideLocationName?: boolean;
}

const TimeOnMarketLocationSelector: React.FC<TimeOnMarketLocationSelectorProps> = ({
    selectedLocationType,
    selectedLocationName,
    onLocationTypeChange,
    onLocationNameChange,
    hideLocationName = false
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [locationTypes, setLocationTypes] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadLocations = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getLocations(selectedLocationType);
            setLocations(response);
        } catch (error) {
            console.error('Error loading locations:', error);
            setError('Failed to load locations');
        } finally {
            setLoading(false);
        }
    }, [selectedLocationType]);

    useEffect(() => {
        const fetchLocationTypes = async () => {
            try {
                setLoading(true);
                const types = await getLocationTypes();
                setLocationTypes(types);
            } catch (error) {
                console.error('Error loading location types:', error);
                setError('Failed to load location types');
            } finally {
                setLoading(false);
            }
        };
        fetchLocationTypes();
    }, []);

    useEffect(() => {
        if (selectedLocationType) {
            loadLocations();
        }
    }, [selectedLocationType, loadLocations]);

    const handleTypeChange = (event: SelectChangeEvent) => {
        onLocationTypeChange(event.target.value);
    };

    const handleLocationChange = (event: React.SyntheticEvent, value: string | null) => {
        if (value) {
            onLocationNameChange(value);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2,
                width: '100%',
                mb: 3
            }}
        >
            <FormControl
                sx={{
                    minWidth: isMobile ? '100%' : 200
                }}
            >
                <InputLabel>Location Type</InputLabel>
                <Select
                    value={selectedLocationType}
                    label="Location Type"
                    onChange={handleTypeChange}
                    disabled={loading}
                >
                    {locationTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {!hideLocationName && (
                <Autocomplete
                    value={selectedLocationName}
                    onChange={handleLocationChange}
                    options={locations}
                    sx={{
                        minWidth: isMobile ? '100%' : 300
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Location Name"
                            variant="outlined"
                        />
                    )}
                    disabled={loading || !selectedLocationType}
                />
            )}
        </Box>
    );
};

export default TimeOnMarketLocationSelector; 