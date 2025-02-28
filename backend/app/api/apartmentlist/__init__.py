"""
ApartmentList API routes package.
"""

from .rent_routes import router as rent_router
from .vacancy_routes import router as vacancy_router

__all__ = ["rent_router", "vacancy_router"] 