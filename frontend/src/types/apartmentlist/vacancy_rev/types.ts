export interface LocationData {
    location_type: string;
    location_name: string;
    month1_vacancy?: number;
    month2_vacancy?: number;
    month3_vacancy?: number;
    month1_year_month?: string;
    month2_year_month?: string;
    month3_year_month?: string;
    yoy_change?: number;
}

export interface VacancySummaryResponse {
    top_locations: LocationData[];
    bottom_locations: LocationData[];
}

export interface VacancyDetailsResponse {
    location_data: LocationData;
    historical_data: {
        year_month: string;
        vacancy_rate: number;
    }[];
}

export interface LocationType {
    location_type: string;
}

export interface Location {
    location_name: string;
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

export interface TimeSeriesData {
    dates: string[];
    vacancy_index: {
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
    data: Array<{
        location_name: string;
    }>;
}

export interface ErrorResponse {
    error: string;
    detail?: string;
} 