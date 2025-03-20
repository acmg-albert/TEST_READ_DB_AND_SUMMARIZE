import React, { useState } from 'react';
import { Container, Typography, Box, Alert, Snackbar } from '@mui/material';
import { SearchForm } from '../../components/rentcast/rent-estimates/SearchForm';
import { ResultsDisplay } from '../../components/rentcast/rent-estimates/ResultsDisplay';
import { rentEstimatesService } from '../../services/rentcast/rent-estimates/api';
import { SearchFormData, RentCompsResponse } from '../../types/rentcast/rent-estimates/types';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';

const RentTrendCompsContent: React.FC = () => {
    const [results, setResults] = useState<RentCompsResponse | null>(null);
    const [targetAddress, setTargetAddress] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: SearchFormData) => {
        try {
            setIsLoading(true);
            setError(null);
            setTargetAddress(data.address);
            const response = await rentEstimatesService.getRentComps(data);
            setResults(response);
        } catch (err) {
            setError('Error fetching rent estimates data. Please try again later.');
            console.error('Error fetching rent estimates:', err);
        } finally {
            setIsLoading(false);
        }
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
                    Rent Trend and Comparables Analysis
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Get accurate rent estimates and comparable properties based on location and property characteristics.
                </Typography>
            </Box>

            <SearchForm onSubmit={handleSubmit} isLoading={isLoading} />
            {results && <ResultsDisplay data={results} targetAddress={targetAddress} />}
            
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

const RentTrendComps: React.FC = () => {
    return (
        <ProtectedRoute pageId="rent-trend-comps">
            <RentTrendCompsContent />
        </ProtectedRoute>
    );
};

export default RentTrendComps; 