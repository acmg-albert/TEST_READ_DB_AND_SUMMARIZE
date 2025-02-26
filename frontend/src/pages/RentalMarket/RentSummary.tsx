import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { DataTable } from '../../components/DataTable';
import { api } from '../../services/api';
import { SummaryData } from '../../types';
import { useNavigate } from 'react-router-dom';

export const SummaryPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await api.getSummary();
                setSummaryData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching summary data:', err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="container-fluid header bg-white p-0">
                <div className="row g-0 align-items-center justify-content-center min-vh-100">
                    <CircularProgress />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid header bg-white p-0">
                <div className="row g-0 align-items-center justify-content-center min-vh-100">
                    <Typography color="error">{error}</Typography>
                </div>
            </div>
        );
    }

    if (!summaryData) {
        return null;
    }

    return (
        <>
            {/* Header Start */}
            <div className="container-fluid header bg-white p-0">
                <div className="row g-0 align-items-center justify-content-center py-5">
                    <div className="col-md-10 text-center">
                        <h1 className="display-4 text-primary mb-3">Rent Price Summary</h1>
                        <button 
                            className="btn btn-primary py-3 px-5"
                            onClick={() => navigate('/rental/apartments-rent/National/United States')}
                        >
                            View National Details
                        </button>
                    </div>
                </div>
            </div>
            {/* Header End */}

            {/* Summary Start */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
                        <h2 className="mb-3">Trailing 3-Month Year-over-Year Changes</h2>
                    </div>

                    <div className="row g-4">
                        <div className="col-12">
                            <DataTable
                                title="States"
                                topLocations={summaryData.states.top}
                                bottomLocations={summaryData.states.bottom}
                                locationType="State"
                            />
                        </div>

                        <div className="col-12">
                            <DataTable
                                title="Metropolitan Areas"
                                topLocations={summaryData.metros.top}
                                bottomLocations={summaryData.metros.bottom}
                                locationType="Metro"
                            />
                        </div>

                        <div className="col-12">
                            <DataTable
                                title="Cities"
                                topLocations={summaryData.cities.top}
                                bottomLocations={summaryData.cities.bottom}
                                locationType="City"
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Summary End */}
        </>
    );
}; 