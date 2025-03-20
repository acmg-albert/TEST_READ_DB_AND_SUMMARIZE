import axios, { AxiosInstance } from 'axios';
import { SearchFormData, RentCompsResponse } from '../../../types/rentcast/rent-estimates/types';

const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:8001/api'}/rentcast`;

export class RentEstimatesService {
    private readonly axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    private handleError(error: unknown): never {
        console.error('RentCast API Error:', error);
        throw error;
    }

    async getRentComps(data: SearchFormData): Promise<RentCompsResponse> {
        try {
            const params = {
                address: data.address,
                propertyType: data.propertyType,
                ...(data.bedrooms && { bedrooms: data.bedrooms }),
                ...(data.bathrooms && { bathrooms: data.bathrooms }),
                ...(data.squareFootage && { squareFootage: data.squareFootage }),
                ...(data.maxRadius && { maxRadius: data.maxRadius }),
                ...(data.daysOld && { daysOld: data.daysOld }),
                ...(data.compCount && { compCount: data.compCount })
            };
            
            const response = await this.axiosInstance.get<RentCompsResponse>('/rent-estimates/long-term', {
                params
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }
}

export const rentEstimatesService = new RentEstimatesService();