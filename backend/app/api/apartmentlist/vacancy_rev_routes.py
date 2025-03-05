"""
Vacancy Rev API routes module.
Handles API endpoints for optimized apartment vacancy data.
"""

import logging
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from ...processors.apartmentlist.vacancy_rev_processor import VacancyRevProcessor

# Configure logging
logger = logging.getLogger(__name__)

# Create router instance with tags for better API documentation
router = APIRouter(
    prefix="/vacancy-rev",
    tags=["vacancy-rev"]
)

# Initialize processor
processor = VacancyRevProcessor()

@router.get("/location-types")
async def get_location_types() -> Dict[str, Any]:
    """
    Get all available location types.
    
    Returns:
        Dictionary containing list of location types
    """
    logger.info("Getting all location types")
    try:
        result = processor.get_location_types()
        if "error" in result:
            logger.error(f"Error getting location types: {result['error']}")
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except Exception as e:
        logger.error(f"Error processing location types: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/summary/{location_type}")
async def get_vacancy_summary(location_type: str) -> Dict[str, Any]:
    """
    Get vacancy rate summary data for locations of specified type.
    
    Args:
        location_type: Type of location (State, Metro, City)
        
    Returns:
        Dictionary containing summary data and metadata
    """
    logger.info(f"Getting vacancy summary for location type: {location_type}")
    try:
        result = processor.get_summary_data(location_type)
        if "error" in result:
            logger.error(f"Error getting summary data: {result['error']}")
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except Exception as e:
        logger.error(f"Error processing summary data: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/details/{location_type}/{location_name}")
async def get_vacancy_details(
    location_type: str,
    location_name: str
) -> Dict[str, Any]:
    """
    Get detailed vacancy rate data for a specific location.
    
    Args:
        location_type: Type of location
        location_name: Name of location
        
    Returns:
        Dictionary containing location details and time series data
    """
    logger.info(f"Getting vacancy details for {location_type}: {location_name}")
    try:
        result = processor.get_location_details(location_type, location_name)
        if "error" in result:
            logger.error(f"Error getting location details: {result['error']}")
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except Exception as e:
        logger.error(f"Error processing location details: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/locations/{location_type}")
async def get_locations(location_type: str) -> Dict[str, Any]:
    """
    Get available locations of specified type.
    
    Args:
        location_type: Type of location
        
    Returns:
        Dictionary containing list of locations
    """
    logger.info(f"Getting locations for type: {location_type}")
    try:
        result = processor.get_locations_by_type(location_type)
        if "error" in result:
            logger.error(f"Error getting locations: {result['error']}")
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except Exception as e:
        logger.error(f"Error processing locations: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e)) 