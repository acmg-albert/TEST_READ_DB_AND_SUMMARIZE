import React from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    MenuItem,
    CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { SearchFormData, PropertyTypes } from '../../../types/rentcast/rent-estimates/types';

interface SearchFormProps {
    onSubmit: (data: SearchFormData) => void;
    isLoading?: boolean;
}

const defaultValues: SearchFormData = {
    address: '',
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 1,
    squareFootage: 1000,
    maxRadius: 2,
    daysOld: 365,
    compCount: 20
};

export const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, isLoading = false }) => {
    const { control, handleSubmit } = useForm<SearchFormData>({
        defaultValues
    });

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Controller
                        name="address"
                        control={control}
                        rules={{ required: 'Address is required' }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Property Address"
                                error={!!error}
                                helperText={error?.message}
                                disabled={isLoading}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller
                        name="propertyType"
                        control={control}
                        rules={{ required: 'Property type is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                fullWidth
                                label="Property Type"
                                disabled={isLoading}
                            >
                                {PropertyTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller
                        name="squareFootage"
                        control={control}
                        rules={{ min: { value: 100, message: 'Minimum square footage is 100' } }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                type="number"
                                fullWidth
                                label="Square Footage"
                                error={!!error}
                                helperText={error?.message}
                                disabled={isLoading}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller
                        name="bedrooms"
                        control={control}
                        rules={{ min: { value: 0, message: 'Minimum bedrooms is 0' } }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                type="number"
                                fullWidth
                                label="Bedrooms"
                                error={!!error}
                                helperText={error?.message}
                                disabled={isLoading}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller
                        name="bathrooms"
                        control={control}
                        rules={{ min: { value: 0, message: 'Minimum bathrooms is 0' } }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                type="number"
                                fullWidth
                                label="Bathrooms"
                                error={!!error}
                                helperText={error?.message}
                                disabled={isLoading}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Controller
                        name="maxRadius"
                        control={control}
                        rules={{ min: { value: 0.1, message: 'Minimum radius is 0.1 miles' } }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                type="number"
                                fullWidth
                                label="Max Radius (miles)"
                                error={!!error}
                                helperText={error?.message}
                                disabled={isLoading}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Controller
                        name="daysOld"
                        control={control}
                        rules={{ min: { value: 1, message: 'Minimum days old is 1' } }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                type="number"
                                fullWidth
                                label="Days Old"
                                error={!!error}
                                helperText={error?.message}
                                disabled={isLoading}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Controller
                        name="compCount"
                        control={control}
                        rules={{ 
                            min: { value: 5, message: 'Minimum comparables is 5' },
                            max: { value: 25, message: 'Maximum comparables is 25' }
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                type="number"
                                fullWidth
                                label="Number of Comparables"
                                error={!!error}
                                helperText={error?.message}
                                disabled={isLoading}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isLoading}
                        sx={{
                            backgroundColor: '#0AB3B0',
                            '&:hover': {
                                backgroundColor: '#089690'
                            }
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Get Rent Estimates'
                        )}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}; 