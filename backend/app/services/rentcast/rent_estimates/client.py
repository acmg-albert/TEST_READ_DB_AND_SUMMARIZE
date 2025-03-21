"""
RentCast Rent Estimates API client.
Handles API calls specific to rent estimates functionality.
"""

from typing import Dict, Any
from ..base import BaseRentCastClient

class RentEstimatesClient(BaseRentCastClient):
    """Client for RentCast Rent Estimates API endpoints."""
    
    def __init__(self):
        """Initialize the rent estimates client."""
        super().__init__("avm/rent")
        
    async def get_rent_comps(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get rent comparables data.
        
        Args:
            params: Query parameters for the request
            
        Returns:
            Rent comparables data
        """
        return await self._make_request("long-term", params) 