import axios from 'axios';
import {
    SummaryData,
    LocationDetail,
    LocationTypesResponse,
    LocationsResponse,
    ErrorResponse,
    RentSummaryResponse
} from '../../../types/apartmentlist/rent_rev/types';
import { API_BASE_URL } from '../../../config';

const API_ENDPOINT = `${API_BASE_URL}/rent-rev`;

export const fetchRentSummary = async (locationType: string): Promise<RentSummaryResponse> => {
    try {
        const response = await axios.get(`${API_ENDPOINT}/summary/${locationType}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rent summary:', error);
        throw error;
    }
};

export const fetchRentDetails = async (
    locationType: string,
    locationName: string
): Promise<LocationDetail> => {
    try {
        const encodedLocationType = encodeURIComponent(locationType);
        const encodedLocationName = encodeURIComponent(locationName);
        const response = await axios.get(`${API_ENDPOINT}/details/${encodedLocationType}/${encodedLocationName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rent details:', error);
        throw error;
    }
};

export const fetchLocationTypes = async (): Promise<LocationTypesResponse> => {
    try {
        const response = await axios.get(`${API_ENDPOINT}/location-types`);
        return response.data;
    } catch (error) {
        console.error('Error fetching location types:', error);
        throw error;
    }
};

export const fetchLocations = async (locationType: string): Promise<LocationsResponse> => {
    try {
        const response = await axios.get(`${API_ENDPOINT}/locations/${locationType}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}; 