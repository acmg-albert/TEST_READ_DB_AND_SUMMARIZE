"""
API routes module.
"""

from .apartmentlist.rent_routes import router as rent_router
from .apartmentlist.vacancy_routes import router as vacancy_router

__all__ = ["rent_router", "vacancy_router"] 