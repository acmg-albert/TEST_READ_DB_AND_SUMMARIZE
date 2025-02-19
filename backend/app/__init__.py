"""
Backend application initialization.
This module initializes the FastAPI application and its dependencies.
"""

from .main import app
from .data_processor import *
from .database import db 