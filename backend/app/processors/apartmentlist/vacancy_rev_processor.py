"""
Vacancy Rev processor module.
Handles business logic for apartment vacancy rate data.
"""

import logging
from typing import Dict, Any, List, Tuple
from ...database.apartmentlist.vacancy_rev_db import VacancyRevDBClient

# Configure logging
logger = logging.getLogger(__name__)

class VacancyRevProcessor:
    """Processor for vacancy rate data."""
    
    def __init__(self):
        """Initialize processor with database client."""
        self.db_client = VacancyRevDBClient()
        
    def get_summary_data(self, location_type: str) -> Dict[str, Any]:
        """
        Get summary data for locations of specified type.
        
        Args:
            location_type: Type of location (State, Metro, City)
            
        Returns:
            Dictionary containing summary data and metadata
        """
        try:
            # Get latest months for metadata
            latest_months = self.db_client.get_latest_months(3)
            if not latest_months:
                return {"error": "No data available"}
                
            # Get location data
            locations = self.db_client.get_location_data(location_type)
            if not locations:
                return {"error": f"No data available for {location_type}"}
                
            # Split into top and bottom locations
            top_count = 3 if location_type == 'State' else 10
            top_locations, bottom_locations = self._split_data(locations, top_count)
            
            return {
                "metadata": {
                    "latest_months": latest_months,
                    "location_type": location_type,
                    "data_version": "1.0",
                    "last_updated": latest_months[0] if latest_months else None
                },
                "data": {
                    "top": top_locations,
                    "bottom": bottom_locations
                }
            }
            
        except Exception as e:
            logger.error(f"Error processing summary data: {str(e)}")
            return {"error": "Failed to process summary data"}
            
    def _split_data(
        self,
        data: List[Dict[str, Any]],
        top_count: int
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Split location data into top and bottom groups.
        
        Args:
            data: List of location data
            top_count: Number of locations to include in each group
            
        Returns:
            Tuple of (top_locations, bottom_locations)
        """
        # Sort by YoY change
        sorted_data = sorted(
            data,
            key=lambda x: x.get('yoy_change', 0),
            reverse=True
        )
        
        # Get top and bottom locations
        top = sorted_data[:top_count]
        bottom = sorted_data[-top_count:][::-1]  # Reverse to show largest negative first
        
        return top, bottom
        
    def get_location_details(
        self,
        location_type: str,
        location_name: str
    ) -> Dict[str, Any]:
        """
        Get detailed data for a specific location.
        
        Args:
            location_type: Type of location
            location_name: Name of location
            
        Returns:
            Dictionary containing location details and time series data
        """
        try:
            # Get time series data
            time_series = self.db_client.get_location_time_series(
                location_type,
                location_name
            )
            
            if not time_series:
                return {"error": f"No data available for {location_name}"}
                
            return {
                "metadata": {
                    "location_type": location_type,
                    "location_name": location_name,
                    "data_version": "1.0"
                },
                "data": time_series
            }
            
        except Exception as e:
            logger.error(f"Error processing location details: {str(e)}")
            return {"error": "Failed to process location details"}
            
    def get_location_types(self) -> Dict[str, Any]:
        """
        Get all available location types.
        
        Returns:
            Dictionary containing list of location types
        """
        try:
            types = self.db_client.get_location_types()
            return {
                "metadata": {
                    "data_version": "1.0"
                },
                "data": types
            }
            
        except Exception as e:
            logger.error(f"Error processing location types: {str(e)}")
            return {"error": "Failed to get location types"}
            
    def get_locations_by_type(self, location_type: str) -> Dict[str, Any]:
        """
        Get available locations for a specific type.
        
        Args:
            location_type: Type of location
            
        Returns:
            Dictionary containing list of locations
        """
        try:
            locations = self.db_client.get_locations_by_type(location_type)
            return {
                "metadata": {
                    "location_type": location_type,
                    "data_version": "1.0"
                },
                "data": locations
            }
            
        except Exception as e:
            logger.error(f"Error processing locations: {str(e)}")
            return {"error": "Failed to get locations"} 