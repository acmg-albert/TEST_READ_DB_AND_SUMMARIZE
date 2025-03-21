import axios from 'axios';
import {
    LocationTypesResponse,
    LocationsResponse,
    SummaryData,
    LocationDetail,
    ErrorResponse
} from '../../../types/apartmentlist/time_on_market/types';

const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://192.168.4.26:8001/api'}/time-on-market`;

export const getLocationTypes = async (): Promise<string[]> => {
    try {
        const response = await axios.get<LocationTypesResponse>(
            `${API_BASE_URL}/location-types`
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching location types:', error);
        throw error;
    }
};

export const getLocations = async (
    locationType: string
): Promise<string[]> => {
    try {
        const response = await axios.get<LocationsResponse>(
            `${API_BASE_URL}/locations/${locationType}`
        );
        return response.data.data.map(location => location.location_name);
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
};

export const getTimeOnMarketSummary = async (
    locationType: string
): Promise<SummaryData> => {
    try {
        const response = await axios.get<SummaryData>(
            `${API_BASE_URL}/summary/${locationType}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching time on market summary:', error);
        throw error;
    }
};

export const getTimeOnMarketDetails = async (
    locationType: string,
    locationName: string
): Promise<LocationDetail> => {
    try {
        const response = await axios.get<LocationDetail>(
            `${API_BASE_URL}/details/${locationType}/${locationName}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching time on market details:', error);
        throw error;
    }
}; 