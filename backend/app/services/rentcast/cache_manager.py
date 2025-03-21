"""
Cache manager for RentCast API responses.
Implements caching using Redis.
"""

import logging
import json
from typing import Dict, Any, Optional
from redis import asyncio as aioredis
from ...core.config import settings

# Configure logging
logger = logging.getLogger(__name__)

class CacheManager:
    """Manager for caching API responses."""
    
    def __init__(self):
        """Initialize the cache manager."""
        self.redis = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
        self.ttl = 1800  # 30 minutes in seconds
        
    async def get(self, key: str) -> Optional[Dict[str, Any]]:
        """
        Get cached data by key.
        
        Args:
            key: Cache key
            
        Returns:
            Cached data if exists, None otherwise
        """
        try:
            data = await self.redis.get(key)
            if data:
                return json.loads(data)
            return None
        except Exception as e:
            logger.error(f"Error getting cached data: {str(e)}")
            return None
            
    async def set(self, key: str, value: Dict[str, Any]) -> bool:
        """
        Cache data with key.
        
        Args:
            key: Cache key
            value: Data to cache
            
        Returns:
            True if successful, False otherwise
        """
        try:
            await self.redis.setex(
                key,
                self.ttl,
                json.dumps(value)
            )
            return True
        except Exception as e:
            logger.error(f"Error setting cached data: {str(e)}")
            return False 