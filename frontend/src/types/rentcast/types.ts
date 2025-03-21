// RentCast API response types
export interface Comparable {
    id: string;
    formattedAddress: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    zipCode: string;
    county: string;
    latitude: number;
    longitude: number;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    lotSize: number;
    yearBuilt: number;
    price: number;
    listingType: string;
    listedDate: string;
    removedDate: string | null;
    lastSeenDate: string;
    daysOnMarket: number;
    distance: number;
    daysOld: number;
    correlation: number;
}

export interface RentCompsResponse {
    rent: number;
    rentRangeLow: number;
    rentRangeHigh: number;
    latitude: number;
    longitude: number;
    comparables: Comparable[];
}

// Search form types
export interface SearchFormData {
    address: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    maxRadius?: number;
    daysOld: number;
    compCount: number;
}

export const PropertyTypes = [
    'Single Family',
    'Condo',
    'Townhouse',
    'Manufactured',
    'Multi-family',
    'Apartment'
] as const;

export type PropertyType = typeof PropertyTypes[number]; 