import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocationSelector } from '../../components/LocationSelector';
import './RentDetails.css';

const RentDetails: React.FC = () => {
    const navigate = useNavigate();
    const [locationType, setLocationType] = useState('National');
    const [locationName, setLocationName] = useState('United States');

    const handleLocationChange = (type: string, name: string) => {
        setLocationType(type);
        setLocationName(name);
    };

    return (
        <div className="rent-details-container container-fluid" style={{ padding: 0, width: '100%' }}>
            <div className="rent-details-wrapper content-wrapper" style={{ 
                padding: '3rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <div className="rent-details-title-section title-section" style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '2rem 0 3rem 0',
                    paddingTop: '2rem'
                }}>
                    <h1 className="rent-details-main-title main-title" style={{
                        color: '#4CC9C0',
                        fontSize: '2.2rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: '2rem',
                        lineHeight: 1.2
                    }}>
                        Apartments Rent Data by Given Location
                    </h1>
                    <button 
                        className="rent-details-nav-button nav-button"
                        onClick={() => navigate('/rental/apartments-rent')}
                        style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            marginBottom: '3rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        Back to Summary Page
                    </button>
                </div>

                <div className="rent-details-selector-section selector-section" style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '3rem',
                    padding: '0 1rem'
                }}>
                    <LocationSelector 
                        onLocationChange={handleLocationChange}
                        initialLocationType={locationType}
                        initialLocationName={locationName}
                    />
                </div>

                <div className="rent-details-chart-section chart-section" style={{
                    width: '100%',
                    padding: '0 1rem'
                }}>
                    {/* Charts will be rendered here */}
                </div>
            </div>
        </div>
    );
};

export default RentDetails; 