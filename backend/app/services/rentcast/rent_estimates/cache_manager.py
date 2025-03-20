"""
Cache manager for RentCast rent estimates.
Implements caching using Redis with graceful fallback.
"""

import logging
import json
import hashlib
from typing import Dict, Any, Optional
from redis import asyncio as aioredis
from redis.exceptions import ConnectionError
from ....core.config import settings

# Configure logging
logger = logging.getLogger(__name__)

class RentEstimatesCacheManager:
    """Manager for caching rent estimates responses."""
    
    def __init__(self):
        """Initialize the cache manager."""
        self.redis = None
        self.ttl = 1800  # 30 minutes in seconds
        self._init_redis()
        
    def _init_redis(self) -> None:
        """Initialize Redis connection with error handling."""
        if not settings.REDIS_URL:
            logger.info("Redis URL not configured. Cache will be disabled.")
            return

        try:
            self.redis = aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
            logger.info("Successfully connected to Redis")
        except Exception as e:
            logger.warning(f"Failed to connect to Redis: {str(e)}. Cache will be disabled.")
            self.redis = None
        
    def _generate_cache_key(self, params: Dict[str, Any]) -> str:
        """
        Generate a cache key based on all parameters.
        
        Args:
            params: Dictionary of request parameters
            
        Returns:
            Cache key string
        """
        # Sort parameters to ensure consistent key generation
        param_str = json.dumps(params, sort_keys=True)
        # Generate MD5 hash of parameters
        params_hash = hashlib.md5(param_str.encode()).hexdigest()
        # Create key with prefix
        return f"rentcast:rent_estimates:{params_hash}"
        
    async def get(self, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Get cached data for parameters.
        
        Args:
            params: Dictionary of request parameters
            
        Returns:
            Cached data if exists and valid, None otherwise
        """
        if not self.redis:
            return None
            
        try:
            key = self._generate_cache_key(params)
            data = await self.redis.get(key)
            if data:
                cached_data = json.loads(data)
                # Verify parameters match
                if cached_data.get('params') == params:
                    logger.info(f"Cache hit for key: {key}")
                    return cached_data.get('response')
            return None
        except Exception as e:
            logger.error(f"Error getting cached data: {str(e)}")
            # Disable Redis on error
            self.redis = None
            return None
            
    async def set(self, params: Dict[str, Any], response: Dict[str, Any]) -> bool:
        """
        Cache response data with parameters.
        
        Args:
            params: Dictionary of request parameters
            response: API response data to cache
            
        Returns:
            True if successful, False otherwise
        """
        if not self.redis:
            return False
            
        try:
            key = self._generate_cache_key(params)
            cache_data = {
                'params': params,
                'response': response
            }
            await self.redis.setex(
                key,
                self.ttl,
                json.dumps(cache_data)
            )
            logger.info(f"Cached data for key: {key}")
            return True
        except Exception as e:
            logger.error(f"Error setting cached data: {str(e)}")
            # Disable Redis on error
            self.redis = None
            return False 