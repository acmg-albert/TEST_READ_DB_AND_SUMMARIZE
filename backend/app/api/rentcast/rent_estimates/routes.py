"""
RentCast Rent Estimates API routes.
Handles endpoints for rent estimates functionality.
"""

import logging
import httpx
import json
import os
import hashlib
from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, Optional
from ....core.config import settings
from ....services.rentcast.rent_estimates.cache_manager import RentEstimatesCacheManager
from ....services.rentcast.rent_estimates.client import RentEstimatesClient

# Configure logging
logger = logging.getLogger(__name__)

# Create router instance
router = APIRouter(
    prefix="/rent-estimates",
    tags=["rent-estimates"]
)

# Initialize services
client = RentEstimatesClient()
cache_manager = RentEstimatesCacheManager()

# 修正 API URL 格式
RENTCAST_API_URL = "https://api.rentcast.io/v1/avm/rent/long-term"

# Mock data configuration
MOCK_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 
                            "mock_data", "rentcast", "rent_estimates")
USE_MOCK_DATA = settings.DEBUG  # 在开发模式下使用 mock 数据

def generate_params_hash(params: Dict[str, Any]) -> str:
    """
    生成包含所有参数的哈希值
    """
    # 将参数转换为排序后的字符串，确保相同参数生成相同的哈希值
    param_str = json.dumps(params, sort_keys=True)
    return hashlib.md5(param_str.encode()).hexdigest()

def save_mock_data(params: Dict[str, Any], data: Dict[str, Any]) -> None:
    """保存响应数据作为 mock 数据"""
    try:
        os.makedirs(MOCK_DATA_DIR, exist_ok=True)
        # 使用地址和参数哈希值组合作为文件名
        params_hash = generate_params_hash(params)
        address = params['address'].replace(' ', '_').replace(',', '').replace('/', '_')
        filename = f"{address}_{params_hash}.json"
        filepath = os.path.join(MOCK_DATA_DIR, filename)
        
        # 保存参数和响应数据
        save_data = {
            'params': params,
            'response': data
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(save_data, f, indent=2, ensure_ascii=False)
            logger.info(f"Saved mock data to {filepath}")
    except Exception as e:
        logger.error(f"Error saving mock data: {str(e)}")

def get_mock_data(params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """获取 mock 数据"""
    try:
        # 使用地址和参数哈希值查找 mock 数据
        params_hash = generate_params_hash(params)
        address = params['address'].replace(' ', '_').replace(',', '').replace('/', '_')
        filename = f"{address}_{params_hash}.json"
        filepath = os.path.join(MOCK_DATA_DIR, filename)
        
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # 验证参数是否完全匹配
                if data['params'] == params:
                    logger.info(f"Using mock data from {filepath}")
                    return data['response']
    except Exception as e:
        logger.error(f"Error reading mock data: {str(e)}")
    return None

@router.get("/long-term")
async def get_rent_comps(
    address: str = Query(..., description="Property address"),
    propertyType: str = Query("Apartment", description="Property type"),
    bedrooms: float = Query(2.0, description="Number of bedrooms"),
    bathrooms: float = Query(1.0, description="Number of bathrooms"),
    squareFootage: float = Query(1000.0, description="Square footage"),
    maxRadius: float = Query(2.0, description="Maximum radius in miles"),
    daysOld: int = Query(365, ge=1, description="Maximum days since last seen"),
    compCount: int = Query(20, ge=5, le=25, description="Number of comparables")
) -> Dict[str, Any]:
    """
    Get rent comparables data for a property.
    """
    logger.info(f"Received rent comps request for address: {address}")
    
    try:
        # 准备请求参数
        params = {
            "address": address,
            "propertyType": propertyType,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "squareFootage": squareFootage,
            "maxRadius": maxRadius,
            "daysOld": daysOld,
            "compCount": compCount
        }
        
        logger.info(f"Request parameters: {params}")
        
        # 首先检查缓存
        cached_data = await cache_manager.get(params)
        if cached_data:
            logger.info("Returning cached data")
            return cached_data

        # 如果是开发模式，尝试使用 mock 数据
        if USE_MOCK_DATA:
            mock_data = get_mock_data(params)
            if mock_data:
                return mock_data
        
        logger.info(f"Sending request to RentCast API with params: {params}")
            
        # 准备请求头
        headers = {
            "accept": "application/json",
            "X-Api-Key": settings.RENTCAST_API_KEY
        }
            
        # 发送请求到 RentCast API
        async with httpx.AsyncClient() as client:
            logger.info(f"Making request to: {RENTCAST_API_URL}")
            response = await client.get(
                RENTCAST_API_URL,
                params=params,
                headers=headers,
                timeout=30.0
            )
            
            # 检查响应状态
            response.raise_for_status()
            logger.info("Successfully received response from RentCast API")
            
            # 获取响应数据
            response_data = response.json()
            
            # 保存到缓存
            await cache_manager.set(params, response_data)
            
            # 如果是开发模式，保存响应数据作为 mock 数据
            if USE_MOCK_DATA:
                save_mock_data(params, response_data)
            
            logger.info("Successfully retrieved rent comps data")
            return response_data
            
    except httpx.HTTPError as e:
        logger.error(f"HTTP error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch data from RentCast API: {str(e)}")
    except Exception as e:
        logger.error(f"Error getting rent comps: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e)) 