"""
Vacancy data processing module.
Handles business logic for apartment vacancy data.
"""

from typing import List, Dict, Any, Tuple
from ...database.apartmentlist.vacancy_db import VacancyDBClient

class VacancyProcessor:
    """Processor for apartment vacancy data."""
    
    def __init__(self):
        """Initialize vacancy data processor."""
        self.db = VacancyDBClient()
        
    def get_summary_data(self) -> Dict[str, Any]:
        """
        Get summary data for all location types.
        Returns top and bottom locations for states, metros, and cities.
        
        Returns:
            Dictionary containing:
            - For each location type (states, metros, cities):
                - Top and bottom performers with:
                    - Location name
                    - Latest 3 months' vacancy rates
                    - Trailing 3-month year-over-year change
        """
        # Get data for each location type
        states_data = self.db.get_location_data("State")
        metros_data = self.db.get_location_data("Metro")
        cities_data = self.db.get_location_data("City")
        
        def split_data(data: List[Dict[str, Any]], top_count: int) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
            """Split data into top and bottom performers."""
            # Filter out locations with invalid data
            valid_data = [
                loc for loc in data 
                if loc.get("valid_months_count", 0) == 3 and 
                all(month.get("vacancy_rate") is not None for month in loc.get("monthly_data", []))
            ]
            
            if not valid_data:
                return [], []
                
            # Sort by trailing 3-month YoY change
            sorted_data = sorted(valid_data, key=lambda x: x["trailing_3m_yoy_change"], reverse=True)
            return sorted_data[:top_count], sorted_data[-top_count:][::-1]
        
        # Get top/bottom 3 states and top/bottom 10 metros/cities
        top_states, bottom_states = split_data(states_data, 3)
        top_metros, bottom_metros = split_data(metros_data, 10)
        top_cities, bottom_cities = split_data(cities_data, 10)
        
        def format_location_data(location: Dict[str, Any]) -> Dict[str, Any]:
            """Format location data for response."""
            monthly_data = location.get("monthly_data", [])
            return {
                "location_name": location["location_name"],
                "location_type": location["location_type"],
                "trailing_3m_yoy_change": location["trailing_3m_yoy_change"],
                "monthly_data": [
                    {
                        "year_month": month["year_month"].replace("_", "-"),
                        "vacancy_rate": month["vacancy_rate"],
                        "year_ago_rate": month["year_ago_rate"],
                        "yoy_change": month["yoy_change"]
                    }
                    for month in monthly_data
                ]
            }
        
        return {
            "states": {
                "top": [format_location_data(loc) for loc in top_states],
                "bottom": [format_location_data(loc) for loc in bottom_states]
            },
            "metros": {
                "top": [format_location_data(loc) for loc in top_metros],
                "bottom": [format_location_data(loc) for loc in bottom_metros]
            },
            "cities": {
                "top": [format_location_data(loc) for loc in top_cities],
                "bottom": [format_location_data(loc) for loc in bottom_cities]
            }
        }

    def get_location_details(self, location_type: str, location_name: str) -> Dict[str, Any]:
        """
        Get detailed time series data for a specific location.
        
        Args:
            location_type: Type of location (State, Metro, City)
            location_name: Name of the location
            
        Returns:
            Dictionary containing time series data and metadata
        """
        time_series = self.db.get_location_time_series(location_type, location_name)
        
        if not time_series:
            # Try to get basic data
            locations = self.db.get_location_data(location_type)
            location_data = next((loc for loc in locations if loc["location_name"] == location_name), None)
            
            if location_data:
                return {
                    "location_type": location_type,
                    "location_name": location_name,
                    "trailing_3m_yoy_change": location_data.get("trailing_3m_yoy_change", 0),
                    "valid_months_count": location_data.get("valid_months_count", 0),
                    "monthly_data": location_data.get("monthly_data", []),
                    "time_series": {
                        "dates": [],
                        "vacancy_rate": {"values": [], "yoy_changes": []}
                    }
                }
            return {
                "error": f"No data found for {location_type} {location_name}"
            }
        
        return {
            "location_type": location_type,
            "location_name": location_name,
            "time_series": time_series
        }

    def get_location_types(self) -> List[str]:
        """Get list of available location types."""
        return ["National", "State", "Metro", "County", "City"]

    def get_locations_by_type(self, location_type: str) -> List[Dict[str, str]]:
        """
        Get list of available locations for a specific type.
        
        Args:
            location_type: Type of location to get list for
            
        Returns:
            List of location names and their types
        """
        return self.db.get_locations_by_type(location_type) 