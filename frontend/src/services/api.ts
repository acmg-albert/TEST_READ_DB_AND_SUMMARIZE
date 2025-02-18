import axios from 'axios';
import { SummaryData, LocationDetail } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const api = {
    getSummary: async (): Promise<SummaryData> => {
        const response = await axios.get(`${API_BASE_URL}/summary`);
        return response.data;
    },

    getLocationTypes: async (): Promise<string[]> => {
        const response = await axios.get(`${API_BASE_URL}/location-types`);
        return response.data;
    },

    getLocations: async (locationType: string): Promise<Array<{location_type: string; location_name: string}>> => {
        const response = await axios.get(`${API_BASE_URL}/locations/${locationType}`);
        return response.data;
    },

    getLocationDetails: async (locationType: string, locationName: string): Promise<LocationDetail> => {
        const response = await axios.get(`${API_BASE_URL}/location/${locationType}/${locationName}`);
        return response.data;
    }
}; 