"""
Rent data processing module.
Handles business logic for apartment rent data.
"""

from typing import List, Dict, Any, Tuple
from ...database.apartmentlist.rent_db import RentDBClient

class RentProcessor:
    """Processor for apartment rent data."""
    
    def __init__(self):
        """Initialize rent data processor."""
        self.db = RentDBClient()
        
    def get_summary_data(self) -> Dict[str, Any]:
        """
        Get summary data for all location types.
        Returns top and bottom locations for states, metros, and cities.
        """
        # Get data for each location type
        states_data = self.db.get_location_data("State")
        metros_data = self.db.get_location_data("Metro")
        cities_data = self.db.get_location_data("City")
        
        def split_data(data: List[Dict[str, Any]], top_count: int) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
            """Split data into top and bottom performers."""
            return data[:top_count], data[-top_count:][::-1]
        
        # Get top/bottom 3 states and top/bottom 10 metros/cities
        top_states, bottom_states = split_data(states_data, 3)
        top_metros, bottom_metros = split_data(metros_data, 10)
        top_cities, bottom_cities = split_data(cities_data, 10)
        
        return {
            "states": {
                "top": top_states,
                "bottom": bottom_states
            },
            "metros": {
                "top": top_metros,
                "bottom": bottom_metros
            },
            "cities": {
                "top": top_cities,
                "bottom": bottom_cities
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
                        "overall": {"values": [], "yoy_changes": []},
                        "1br": {"values": [], "yoy_changes": []},
                        "2br": {"values": [], "yoy_changes": []}
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