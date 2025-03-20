import React, { useState } from 'react';
import { Container, Alert, Snackbar } from '@mui/material';
import { SearchForm } from '../components/rentcast/rent-estimates/SearchForm';
import { ResultsDisplay } from '../components/rentcast/rent-estimates/ResultsDisplay';
import { rentEstimatesService } from '../services/rentcast/rent-estimates/api';
import { SearchFormData, RentCompsResponse } from '../types/rentcast/rent-estimates/types';

export const RentEstimates: React.FC = () => {
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
            setError('获取租金估算数据时发生错误，请稍后重试。');
            console.error('Error fetching rent estimates:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
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