export interface LocationData {
    id: number;
    category: string;
    location_type: string;
    location_name: string;
    month1_year_month: string;
    month1_rent_estimate: number;
    month2_year_month: string;
    month2_rent_estimate: number;
    month3_year_month: string;
    month3_rent_estimate: number;
    yoy_change: number;
    created_at: string;
}

export interface RentSummaryResponse {
    metadata: {
        latest_months: string[];
        location_type: string;
        data_version: string;
        last_updated: string;
    };
    data: {
        top: LocationData[];
        bottom: LocationData[];
    };
}

export interface RentDetailsResponse {
    location_data: LocationData;
    historical_data: {
        year_month: string;
        rent_estimate: number;
    }[];
}

export interface LocationType {
    location_type: string;
}

export interface Location {
    location_name: string;
}

export interface SummaryData {
    states: {
        top: LocationData[];
        bottom: LocationData[];
    };
    metros: {
        top: LocationData[];
        bottom: LocationData[];
    };
    cities: {
        top: LocationData[];
        bottom: LocationData[];
    };
}

export interface TimeSeriesData {
    dates: string[];
    rent_estimate: {
        values: number[];
        yoy_changes: number[];
    };
    rent_estimate_1br: {
        values: number[];
        yoy_changes: number[];
    };
    rent_estimate_2br: {
        values: number[];
        yoy_changes: number[];
    };
}

export interface LocationDetail {
    metadata: {
        location_type: string;
        location_name: string;
        data_version: string;
    };
    data: TimeSeriesData;
}

export interface LocationTypesResponse {
    metadata: {
        data_version: string;
    };
    data: string[];
}

export interface LocationsResponse {
    metadata: {
        location_type: string;
        data_version: string;
    };
    data: {
        location_type: string;
        location_name: string;
    }[];
}

export interface ErrorResponse {
    error: string;
} 