import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import {
    LocationTypesResponse,
    LocationsResponse,
    SummaryData,
    LocationDetail,
    ErrorResponse
} from '../../../types/apartmentlist/time_on_market/types';

const TIME_ON_MARKET_API = `${API_BASE_URL}/time-on-market`;

export const getLocationTypes = async (): Promise<string[]> => {
    try {
        const response = await axios.get<LocationTypesResponse>(
            `${TIME_ON_MARKET_API}/location-types`
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
            `${TIME_ON_MARKET_API}/locations/${locationType}`
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
            `${TIME_ON_MARKET_API}/summary/${locationType}`
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
            `${TIME_ON_MARKET_API}/details/${locationType}/${locationName}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching time on market details:', error);
        throw error;
    }
}; 