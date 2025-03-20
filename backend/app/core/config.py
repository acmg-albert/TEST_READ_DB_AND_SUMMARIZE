"""
Application configuration module.
"""

import os
from pydantic_settings import BaseSettings
from typing import Optional, List
from pydantic import model_validator

class Settings(BaseSettings):
    """Application settings."""
    
    # API Configuration
    API_V1_STR: str = "/api"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = int(os.environ.get("PORT", 8001))  # 使用 Render 提供的 PORT 或默认值
    DEBUG: bool = False  # 生产环境默认关闭调试模式
    
    # RentCast API
    RENTCAST_API_KEY: str
    
    # Database Configuration
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # Redis Configuration (Optional)
    REDIS_URL: Optional[str] = None
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    model_config = {
        "case_sensitive": True,
        "env_file": ".env",
        "extra": "allow"
    }

# Create settings instance
settings = Settings() 