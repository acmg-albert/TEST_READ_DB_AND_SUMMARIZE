"""
Vacancy API routes module.
Handles HTTP requests for apartment vacancy data.
"""

import logging
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ...processors.apartmentlist.vacancy_processor import VacancyProcessor

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/vacancy")

# Initialize processor
processor = VacancyProcessor()

@router.get("/summary")
async def get_summary() -> Dict[str, Any]:
    """Get summary data for all location types."""
    try:
        return processor.get_summary_data()
    except Exception as e:
        logger.error(f"Error getting summary data: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get summary data")

@router.get("/location/{location_type}/{location_name}")
async def get_location_details(location_type: str, location_name: str) -> Dict[str, Any]:
    """Get detailed data for a specific location."""
    try:
        return processor.get_location_details(location_type, location_name)
    except Exception as e:
        logger.error(f"Error getting location details: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get location details")

@router.get("/location-types")
async def get_location_types() -> List[str]:
    """Get list of available location types."""
    try:
        return processor.get_location_types()
    except Exception as e:
        logger.error(f"Error getting location types: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get location types")

@router.get("/locations/{location_type}")
async def get_locations_by_type(location_type: str) -> List[Dict[str, str]]:
    """Get list of available locations for a specific type."""
    try:
        return processor.get_locations_by_type(location_type)
    except Exception as e:
        logger.error(f"Error getting locations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get locations") 