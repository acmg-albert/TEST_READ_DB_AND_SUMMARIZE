"""
Main application module.
This module contains the FastAPI application instance and route definitions.
"""

import os
import logging
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from . import data_processor

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Real Estate Analytics API",
    description="API for real estate rent analytics data",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",  # 本地开发
    "https://test-read-db-and-summarize.vercel.app",  # Vercel前端域名
    "https://test-read-db-and-summarize-backend.onrender.com",  # Render后端域名
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for all unhandled exceptions."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )

@app.get("/")
async def root():
    """Root endpoint for API health check."""
    return {"status": "ok", "message": "Real Estate Analytics API is running"}

@app.get("/api/summary", response_model=Dict[str, Any])
async def get_summary():
    """
    Get summary data for all location types.
    Returns top and bottom performers for states, metros, and cities.
    """
    try:
        logger.info("Fetching summary data")
        data = data_processor.get_summary_data()
        if not data:
            raise HTTPException(
                status_code=404,
                detail="No summary data available"
            )
        return data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching summary data: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/location/{location_type}/{location_name}", response_model=Dict[str, Any])
async def get_location_details(
    location_type: str = Path(..., regex="^(National|State|Metro|County|City)$"),
    location_name: str = Path(..., min_length=1)
):
    """
    Get detailed time series data for a specific location.
    """
    try:
        logger.info(f"Fetching details for {location_type} {location_name}")
        
        # 验证location type
        valid_types = data_processor.get_location_types()
        if location_type not in valid_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid location type. Must be one of: {', '.join(valid_types)}"
            )
        
        # 验证location name
        locations = data_processor.get_locations_by_type(location_type)
        if not any(loc["location_name"] == location_name for loc in locations):
            raise HTTPException(
                status_code=404,
                detail=f"Location '{location_name}' not found for type {location_type}"
            )
        
        data = data_processor.get_location_details(location_type, location_name)
        if not data:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for {location_type} {location_name}"
            )
        
        return data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching location details: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/location-types", response_model=List[str])
async def get_location_types():
    """
    Get list of available location types.
    """
    try:
        logger.info("Fetching location types")
        types = data_processor.get_location_types()
        if not types:
            raise HTTPException(
                status_code=404,
                detail="No location types available"
            )
        return types
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching location types: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/locations/{location_type}", response_model=List[Dict[str, str]])
async def get_locations(
    location_type: str = Path(..., regex="^(National|State|Metro|County|City)$")
):
    """
    Get list of available locations for a specific type.
    """
    try:
        logger.info(f"Fetching locations for type {location_type}")
        
        # 验证location type
        valid_types = data_processor.get_location_types()
        if location_type not in valid_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid location type. Must be one of: {', '.join(valid_types)}"
            )
        
        locations = data_processor.get_locations_by_type(location_type)
        if not locations:
            raise HTTPException(
                status_code=404,
                detail=f"No locations found for type {location_type}"
            )
        return locations
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching locations: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))