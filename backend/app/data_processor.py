"""
Data processing module.
Handles data aggregation and calculations for the API endpoints.
"""

from typing import List, Dict, Any, Tuple
from .database import db

def get_summary_data() -> Dict[str, Any]:
    """
    Get summary data for all location types.
    Returns top and bottom locations for states, metros, and cities.
    """
    # Get data for each location type
    states_data = db.get_location_data("State")
    metros_data = db.get_location_data("Metro")
    cities_data = db.get_location_data("City")
    
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

def get_location_details(location_type: str, location_name: str) -> Dict[str, Any]:
    """
    Get detailed time series data for a specific location.
    
    Args:
        location_type: Type of location (State, Metro, City)
        location_name: Name of the location
        
    Returns:
        Dictionary containing time series data and metadata
    """
    time_series = db.get_location_time_series(location_type, location_name)
    
    if not time_series:
        return {
            "error": f"No data found for {location_type} {location_name}"
        }
    
    return {
        "location_type": location_type,
        "location_name": location_name,
        "time_series": time_series
    }

def get_location_types() -> List[str]:
    """Get list of available location types."""
    return ["National", "State", "Metro", "County", "City"]

def get_locations_by_type(location_type: str) -> List[Dict[str, str]]:
    """
    Get list of available locations for a specific type.
    
    Args:
        location_type: Type of location to get list for
        
    Returns:
        List of location names and their types
    """
    # 获取最新的月份
    latest_month = db.get_latest_months(1)[0]
    
    # 只查询最新月份的数据
    response = db.client.table(db.table_name)\
        .select("location_name")\
        .eq("location_type", location_type)\
        .eq("year_month", latest_month)\
        .execute()
    
    if not response.data:
        return []
    
    # Get unique location names
    locations = list(set(item["location_name"] for item in response.data))
    return sorted([{
        "location_type": location_type,
        "location_name": name
    } for name in locations], key=lambda x: x["location_name"]) 