export interface LocationData {
    location_type: string;
    location_name: string;
    year_month: string;
    rent_median: number;
    rent_avg: number;
    rent_index: number;
    rent_yoy_pct: number;
    rent_mom_pct: number;
}

export interface SummaryData {
    states: LocationData[];
    metros: LocationData[];
    cities: LocationData[];
}

export interface RentChartData {
    year_month: string;
    rent_median: number;
    rent_avg: number;
    rent_index: number;
    rent_yoy_pct: number;
    rent_mom_pct: number;
}

export interface LocationSelectorProps {
    initialLocationType: string;
    initialLocationName: string;
    onLocationChange: (type: string, name: string) => void;
} 