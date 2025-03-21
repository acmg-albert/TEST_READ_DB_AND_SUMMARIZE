"""
Base RentCast API client.
Provides common functionality for all RentCast API clients.
"""

import logging
import httpx
from typing import Dict, Any
from urllib.parse import urlencode
from ...core.config import settings

# Configure logging
logger = logging.getLogger(__name__)

class BaseRentCastClient:
    """Base client for making requests to RentCast API."""
    
    def __init__(self, api_path: str):
        """
        Initialize the base API client.
        
        Args:
            api_path: API path segment (e.g., 'avm/rent')
        """
        self.base_url = f"https://api.rentcast.io/v1/{api_path}"
        self.api_key = settings.RENTCAST_API_KEY
        self.headers = {
            "accept": "application/json",
            "X-Api-Key": self.api_key
        }
        
    async def _make_request(
        self,
        endpoint: str,
        params: Dict[str, Any],
        method: str = "GET"
    ) -> Dict[str, Any]:
        """
        Make HTTP request to RentCast API.
        
        Args:
            endpoint: API endpoint
            params: Query parameters
            method: HTTP method
            
        Returns:
            API response data
        """
        try:
            # Encode parameters
            query_string = urlencode(params)
            url = f"{self.base_url}/{endpoint}?{query_string}"
            
            async with httpx.AsyncClient() as client:
                response = await client.request(
                    method,
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