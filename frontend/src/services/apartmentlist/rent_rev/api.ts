import axios from 'axios';
import {
    SummaryData,
    LocationDetail,
    LocationTypesResponse,
    LocationsResponse,
    ErrorResponse,
    RentSummaryResponse
} from '../../../types/apartmentlist/rent_rev/types';

const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://192.168.4.26:8001/api'}/rent-rev`;

export const fetchRentSummary = async (locationType: string): Promise<RentSummaryResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/summary/${locationType}`);
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
        const response = await axios.get(`${API_BASE_URL}/details/${encodedLocationType}/${encodedLocationName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rent details:', error);
        throw error;
    }
};

export const fetchLocationTypes = async (): Promise<LocationTypesResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/location-types`);
        return response.data;
    } catch (error) {
        console.error('Error fetching location types:', error);
        throw error;
    }
};

export const fetchLocations = async (locationType: string): Promise<LocationsResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/locations/${locationType}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}; 