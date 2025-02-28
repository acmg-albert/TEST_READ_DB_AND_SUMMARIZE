"""
Base database connection module.
Handles connection to Supabase and common utilities.
"""

import os
import logging
from typing import Optional
from dotenv import load_dotenv
from supabase import create_client, Client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class BaseDBClient:
    """Base database client class with common functionality."""
    
    def __init__(self):
        """Initialize Supabase client."""
        self.url: str = os.getenv("SUPABASE_URL")
        self.key: str = os.getenv("SUPABASE_KEY")
        if not self.url or not self.key:
            raise ValueError("Missing Supabase credentials in environment variables")
        
        # Create Supabase client
        self.client: Client = create_client(
            supabase_url=self.url,
            supabase_key=self.key
        )
        
    def normalize_location_type(self, location_type: str) -> Optional[str]:
        """
        Normalize location type string.
        
        Args:
            location_type: Raw location type string
            
        Returns:
            Normalized location type or None if invalid
        """
        location_type_map = {
            "National": "National",
            "State": "State",
            "Metro": "Metro",
            "County": "County",
            "City": "City"
        }
        
        normalized_type = location_type_map.get(location_type)
        if not normalized_type:
            logger.error(f"Invalid location type: {location_type}")
            return None
            
        return normalized_type 