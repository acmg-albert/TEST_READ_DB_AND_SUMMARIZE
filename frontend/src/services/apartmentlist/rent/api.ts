import axios from 'axios';
import { SummaryData, LocationData } from '../../../types/apartmentlist/rent/types';
import { API_BASE_URL } from '../../../config';

export interface LocationOption {
    location_type: string;
    location_name: string;
}

export const api = {
    getSummary: async (): Promise<SummaryData> => {
        const response = await axios.get(`${API_BASE_URL}/summary`);
        return response.data;
    },

    getLocationDetails: async (type: string, name: string): Promise<LocationData> => {
        const response = await axios.get(`${API_BASE_URL}/location/${type}/${name}`);
        return response.data;
    },

    getLocationTypes: async (): Promise<string[]> => {
        const response = await axios.get(`${API_BASE_URL}/location-types`);
        return response.data;
    },

    getLocationsByType: async (type: string): Promise<LocationOption[]> => {
        const response = await axios.get(`${API_BASE_URL}/locations/${type}`);
        return response.data;
    }
}; 