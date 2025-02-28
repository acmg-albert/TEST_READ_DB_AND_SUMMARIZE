"""
Data processors module.
"""

from .apartmentlist.rent_processor import RentProcessor
from .apartmentlist.vacancy_processor import VacancyProcessor

__all__ = ["RentProcessor", "VacancyProcessor"] 