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
    API_PORT: int = 8001  # 默认端口
    DEBUG: bool = False
    
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

    @model_validator(mode='before')
    @classmethod
    def validate_port(cls, values: dict) -> dict:
        """验证并设置端口"""
        try:
            port = os.environ.get("PORT")
            if port:
                values["API_PORT"] = int(port)
        except (ValueError, TypeError):
            pass  # 如果转换失败，使用默认值
        return values

# Create settings instance
settings = Settings() 