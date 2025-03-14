export interface LocationData {
    location_type: string;
    location_name: string;
    month1_time_on_market?: number;
    month2_time_on_market?: number;
    month3_time_on_market?: number;
    month1_year_month?: string;
    month2_year_month?: string;
    month3_year_month?: string;
    yoy_change?: number;
}

export interface TimeSeriesData {
    dates: string[];
    time_on_market: {
        values: (number | null)[];
        yoy_changes: (number | null)[];
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

export interface SummaryData {
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
    data: Array<{
        location_name: string;
    }>;
}

export interface ErrorResponse {
    error: string;
} 