"""
Backend application initialization.
This module initializes the FastAPI application and its dependencies.
"""

from backend.app.main import app
from backend.app.data_processor import *
from backend.app.database import db 