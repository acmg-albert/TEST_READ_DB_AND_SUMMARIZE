export interface LocationData {
    location_name: string;
    location_type: string;
    trailing_3m_yoy_change?: number;
    valid_months_count?: number;
    monthly_data?: Array<{
        date: string;
        vacancy_index: number;
        year_ago_vacancy_index?: number;
    }>;
    time_series?: TimeSeriesData;
    error?: string;
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
    vacancy_index: {
        values: number[];
        yoy_changes: number[];
    };
}

export interface LocationDetail {
    location_type: string;
    location_name: string;
    time_series: TimeSeriesData;
} 