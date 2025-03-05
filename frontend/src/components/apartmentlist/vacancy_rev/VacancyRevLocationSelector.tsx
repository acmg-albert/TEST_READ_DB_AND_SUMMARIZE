import React, { useEffect, useState } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Autocomplete,
    TextField,
    useTheme,
    useMediaQuery,
    CircularProgress
} from '@mui/material';
import { fetchLocationTypes, fetchLocations } from '../../../services/apartmentlist/vacancy_rev/api';
import { LocationType, Location } from '../../../types/apartmentlist/vacancy_rev/types';

interface VacancyRevLocationSelectorProps {
    selectedLocationType: string;
    selectedLocationName: string;
    onLocationTypeChange: (type: string) => void;
    onLocationNameChange: (name: string) => void;
    hideLocationName?: boolean;
}

const VacancyRevLocationSelector: React.FC<VacancyRevLocationSelectorProps> = ({
    selectedLocationType,
    selectedLocationName,
    onLocationTypeChange,
    onLocationNameChange,
    hideLocationName = false
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [locationTypes, setLocationTypes] = useState<string[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoadingTypes, setIsLoadingTypes] = useState(false);
    const [isLoadingLocations, setIsLoadingLocations] = useState(false);

    useEffect(() => {
        const loadLocationTypes = async () => {
            setIsLoadingTypes(true);
            try {
                const response = await fetchLocationTypes();
                setLocationTypes(response.data);
            } catch (error) {
                console.error('Error loading location types:', error);
            } finally {
                setIsLoadingTypes(false);
            }
        };
        loadLocationTypes();
    }, []);

    useEffect(() => {
        const loadLocations = async () => {
            if (!selectedLocationType) return;
            setIsLoadingLocations(true);
            try {
                const response = await fetchLocations(selectedLocationType);
                setLocations(response.data);
            } catch (error) {
                console.error('Error loading locations:', error);
            } finally {
                setIsLoadingLocations(false);
            }
        };
        loadLocations();
    }, [selectedLocationType]);

    const handleTypeChange = (event: SelectChangeEvent) => {
        onLocationTypeChange(event.target.value);
    };

    const handleLocationChange = (event: React.SyntheticEvent, value: string | null) => {
        if (value) {
            onLocationNameChange(value);
        }
    };

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
                <InputLabel id="location-type-label">Location Type</InputLabel>
                <Select
                    labelId="location-type-label"
                    id="location-type-select"
                    value={selectedLocationType}
                    label="Location Type"
                    onChange={handleTypeChange}
                    disabled={isLoadingTypes}
                >
                    {locationTypes.map((locationType: string) => (
                        <MenuItem key={locationType} value={locationType}>
                            {locationType}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {!hideLocationName && (
                <Autocomplete
                    id="location-name-select"
                    options={locations.map((location: Location) => location.location_name)}
                    value={selectedLocationName}
                    onChange={handleLocationChange}
                    loading={isLoadingLocations}
                    sx={{
                        minWidth: isMobile ? '100%' : 300
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Location Name"
                            placeholder="Select a location"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {isLoadingLocations ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                />
            )}
        </Box>
    );
};

export default VacancyRevLocationSelector; 