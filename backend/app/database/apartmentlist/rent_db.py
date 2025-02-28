"""
Rent database access module.
Handles data retrieval for apartment rent estimates.
"""

import logging
from typing import List, Dict, Any
from ..base import BaseDBClient

# Configure logging
logger = logging.getLogger(__name__)

class RentDBClient(BaseDBClient):
    """Client for accessing apartment rent data."""
    
    def __init__(self):
        """Initialize rent database client."""
        super().__init__()
        self.table_name: str = "apartment_list_rent_estimates_view"

    def get_latest_months(self, count: int = 3) -> List[str]:
        """Get the latest months from the database in YYYY_MM format."""
        response = self.client.table(self.table_name)\
            .select("year_month")\
            .order("year_month", desc=True)\
            .limit(count)\
            .execute()
        
        logger.info(f"Latest months response: {response.data}")
        
        if not response.data:
            raise ValueError(f"No data found in table {self.table_name}")
        
        latest_months = sorted([item["year_month"] for item in response.data], reverse=True)
        logger.info(f"Latest months: {latest_months}")
        return latest_months

    def get_location_data(self, location_type: str) -> List[Dict[str, Any]]:
        """
        Get rent data for specific location type.
        
        Args:
            location_type: One of 'State', 'Metro', 'City'
        
        Returns:
            List of dictionaries containing location data
        """
        normalized_type = self.normalize_location_type(location_type)
        if not normalized_type:
            return []

        logger.info(f"Querying with normalized type: {normalized_type}")
        
        # Get all available locations for this type
        locations_response = self.client.table(self.table_name)\
            .select("location_name")\
            .eq("location_type", normalized_type)\
            .execute()
        
        if not locations_response.data:
            logger.error(f"No locations found for type: {normalized_type}")
            return []
        
        # Get recent months data
        latest_months = self.get_latest_months(3)
        year_ago_months = [
            f"{int(month.split('_')[0])-1}_{month.split('_')[1]}"
            for month in latest_months
        ]
        
        # Process data for each location
        result = []
        unique_locations = {item["location_name"] for item in locations_response.data}
        
        for location_name in unique_locations:
            try:
                # Get all data for this location
                location_data = self.client.table(self.table_name)\
                    .select("*")\
                    .eq("location_type", normalized_type)\
                    .eq("location_name", location_name)\
                    .in_("year_month", [*latest_months, *year_ago_months])\
                    .execute()
                
                if not location_data.data:
                    continue
                    
                current_data = {}
                year_ago_data = {}
                
                # Process data
                for row in location_data.data:
                    data_point = {
                        "overall": row["rent_estimate_overall"],
                        "1br": row["rent_estimate_1br"],
                        "2br": row["rent_estimate_2br"]
                    }
                    
                    if row["year_month"] in latest_months:
                        current_data[row["year_month"]] = data_point
                    elif row["year_month"] in year_ago_months:
                        year_ago_data[row["year_month"]] = data_point
                
                # Calculate year-over-year changes
                monthly_changes = []
                current_rents = []
                
                for curr_month, year_ago_month in zip(latest_months, year_ago_months):
                    curr_data = current_data.get(curr_month, {})
                    year_ago_data_point = year_ago_data.get(year_ago_month, {})
                    
                    if curr_data and year_ago_data_point:
                        curr_rent = curr_data.get("overall", 0)
                        year_ago_rent = year_ago_data_point.get("overall", 0)
                        
                        if curr_rent > 0 and year_ago_rent > 0:
                            yoy_change = ((curr_rent - year_ago_rent) / year_ago_rent) * 100
                            monthly_changes.append(yoy_change)
                            current_rents.append({
                                "date": curr_month,
                                "overall": curr_rent,
                                "1br": curr_data.get("1br", 0),
                                "2br": curr_data.get("2br", 0),
                                "year_ago_overall": year_ago_rent,
                                "year_ago_1br": year_ago_data_point.get("1br", 0),
                                "year_ago_2br": year_ago_data_point.get("2br", 0)
                            })
                
                if monthly_changes:
                    avg_change = sum(monthly_changes) / len(monthly_changes)
                    result.append({
                        "location_name": location_name,
                        "location_type": normalized_type,
                        "trailing_3m_yoy_change": avg_change,
                        "valid_months_count": len(monthly_changes),
                        "monthly_data": current_rents
                    })
                    
            except Exception as e:
                logger.error(f"Error processing location {location_name}: {str(e)}")
                continue
        
        return sorted(result, key=lambda x: x["trailing_3m_yoy_change"], reverse=True)

    def get_location_time_series(
        self,
        location_type: str,
        location_name: str
    ) -> Dict[str, Any]:
        """
        Get complete time series data for a specific location.
        
        Args:
            location_type: Location type (State, Metro, City)
            location_name: Name of the location
            
        Returns:
            Dictionary containing time series data for overall, 1br, and 2br rents
        """
        normalized_type = self.normalize_location_type(location_type)
        if not normalized_type:
            return {}

        logger.info(f"Querying with normalized type: {normalized_type} for location: {location_name}")
        
        response = self.client.table(self.table_name)\
            .select("*")\
            .eq("location_type", normalized_type)\
            .eq("location_name", location_name)\
            .order("year_month")\
            .execute()
        
        if not response.data:
            logger.error(f"No data found for {normalized_type} {location_name}")
            return {}
        
        # Process time series data
        time_series = {
            "dates": [],
            "overall": {
                "values": [],
                "yoy_changes": []
            },
            "1br": {
                "values": [],
                "yoy_changes": []
            },
            "2br": {
                "values": [],
                "yoy_changes": []
            }
        }
        
        # Create a map of year_month to data for YoY calculations
        data_map = {item["year_month"]: item for item in response.data}
        
        for item in response.data:
            year, month = map(int, item["year_month"].split("_"))
            year_ago = f"{year-1}_{month:02d}"
            
            time_series["dates"].append(item["year_month"])
            
            # Process each metric (overall, 1br, 2br)
            for metric in ["overall", "1br", "2br"]:
                current_value = item[f"rent_estimate_{metric}"]
                time_series[metric]["values"].append(
                    current_value if current_value and current_value > 0 else None
                )
                
                # Calculate YoY change if previous year data exists
                if year_ago in data_map:
                    prev_value = data_map[year_ago][f"rent_estimate_{metric}"]
                    if current_value and prev_value and current_value > 0 and prev_value > 0:
                        yoy_change = ((current_value - prev_value) / prev_value) * 100
                    else:
                        yoy_change = None
                else:
                    yoy_change = None
                    
                time_series[metric]["yoy_changes"].append(yoy_change)
        
        return time_series

    def get_locations_by_type(self, location_type: str) -> List[Dict[str, str]]:
        """
        Get list of available locations for a specific type.
        
        Args:
            location_type: Type of location to get list for
            
        Returns:
            List of location names and their types
        """
        normalized_type = self.normalize_location_type(location_type)
        if not normalized_type:
            return []
            
        # Get latest month
        latest_month = self.get_latest_months(1)[0]
        
        # Query only latest month's data
        response = self.client.table(self.table_name)\
            .select("location_name")\
            .eq("location_type", normalized_type)\
            .eq("year_month", latest_month)\
            .execute()
        
        if not response.data:
            return []
        
        # Get unique location names
        locations = list(set(item["location_name"] for item in response.data))
        return sorted([{
            "location_type": normalized_type,
            "location_name": name
        } for name in locations], key=lambda x: x["location_name"]) 