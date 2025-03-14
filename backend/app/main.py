"""
Main application module.
This module contains the FastAPI application instance and route definitions.
"""

import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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
origins = ["*"]  # 临时允许所有源访问，用于测试

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from .api.apartmentlist.vacancy_rev_routes import router as vacancy_rev_router
from .api.apartmentlist.rent_rev_routes import router as rent_rev_router

# Include routers
app.include_router(
    vacancy_rev_router,
    prefix="/api"
)
app.include_router(
    rent_rev_router,
    prefix="/api"
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