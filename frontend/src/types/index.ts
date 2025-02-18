export interface RentData {
    overall: number;
    '1br': number;
    '2br': number;
}

export interface LocationData {
    location_name: string;
    location_type: string;
    trailing_3m_yoy_change: number;
    valid_months_count: number;
    monthly_data: {
        date: string;
        overall: number;
        '1br': number;
        '2br': number;
        year_ago_overall: number;
        year_ago_1br: number;
        year_ago_2br: number;
    }[];
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
    overall: {
        values: (number | null)[];
        yoy_changes: (number | null)[];
    };
    '1br': {
        values: (number | null)[];
        yoy_changes: (number | null)[];
    };
    '2br': {
        values: (number | null)[];
        yoy_changes: (number | null)[];
    };
}

export interface LocationDetail {
    location_type: string;
    location_name: string;
    time_series: TimeSeriesData;
} 