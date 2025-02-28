"""
Backend application initialization.
This module initializes the FastAPI application and its dependencies.
"""

from .main import app
from .api.apartmentlist.rent_routes import router as rent_router
from .api.apartmentlist.vacancy_routes import router as vacancy_router

# Register routers
app.include_router(rent_router)
app.include_router(vacancy_router) 