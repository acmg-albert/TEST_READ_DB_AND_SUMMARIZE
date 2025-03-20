"""
RentCast API client service.
Handles direct communication with RentCast API.
"""

import logging
import httpx
from typing import Dict, Any
from urllib.parse import urlencode
from ...core.config import settings

# Configure logging
logger = logging.getLogger(__name__)

class RentCastAPIClient:
    """Client for making requests to RentCast API."""
    
    def __init__(self):
        """Initialize the API client."""
        self.base_url = "https://api.rentcast.io/v1"
        self.api_key = settings.RENTCAST_API_KEY
        self.headers = {
            "accept": "application/json",
            "X-Api-Key": self.api_key
        }
        
    async def get_rent_comps(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get rent comparables data from RentCast API.
        
        Args:
            params: Dictionary of query parameters
            
        Returns:
            API response data
        """
        try:
            # Encode parameters
            query_string = urlencode(params)
            url = f"{self.base_url}/avm/rent/long-term?{query_string}"
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    url,
                    headers=self.headers,
                    timeout=30.0
                )
                
                # Check for errors
                response.raise_for_status()
                
                return response.json()
                
        except httpx.HTTPError as e:
            logger.error(f"HTTP error occurred: {str(e)}")
            raise Exception(f"Failed to fetch data from RentCast API: {str(e)}")
        except Exception as e:
            logger.error(f"Error occurred: {str(e)}")
            raise Exception(f"An unexpected error occurred: {str(e)}") 