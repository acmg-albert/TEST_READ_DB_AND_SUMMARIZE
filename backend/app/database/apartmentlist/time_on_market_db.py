"""
Time on Market database client module.
Handles database operations for apartment time on market data.
"""

import logging
from typing import List, Dict, Any, Optional
from ..base import BaseDBClient

# Configure logging
logger = logging.getLogger(__name__)

class TimeOnMarketDBClient(BaseDBClient):
    """Database client for time on market data."""
    
    def __init__(self):
        """Initialize database client."""
        super().__init__()
        self.table_name = 'apartment_list_time_on_market_view'
        self.summary_table = 'apartment_list_time_on_market_summary_view'
        self.locations_table = 'apartment_list_time_on_market_unique_locations_view'
        
    def get_latest_months(self, count: int = 3) -> List[str]:
        """Get the latest months from the database in YYYY_MM format."""
        try:
            response = self.client.table(self.table_name)\
                .select("year_month")\
                .order("year_month", desc=True)\
                .limit(count)\
                .execute()
            
            logger.info(f"Latest months response: {response.data}")
            
            if not response.data:
                logger.error(f"No data found in table {self.table_name}")
                return []
            
            latest_months = sorted([item["year_month"] for item in response.data], reverse=True)
            logger.info(f"Latest months: {latest_months}")
            return latest_months
            
        except Exception as e:
            logger.error(f"Error getting latest months: {str(e)}")
            return []
            
    def get_location_data(self, location_type: str) -> List[Dict[str, Any]]:
        """
        Get time on market data for locations of specified type.
        
        Args:
            location_type: Type of location (State, Metro, City)
            
        Returns:
            List of location data dictionaries
        """
        try:
            response = self.client.table(self.summary_table)\
                .select('*')\
                .eq('location_type', location_type)\
                .execute()
                
            if response.data:
                return response.data
            return []
            
        except Exception as e:
            logger.error(f"Error getting location data: {str(e)}")
            return []
            
    def get_location_time_series(
        self,
        location_type: str,
        location_name: str
    ) -> Dict[str, Any]:
        """
        Get time series data for a specific location.
        
        Args:
            location_type: Type of location
            location_name: Name of location
            
        Returns:
            Dictionary containing time series data
        """
        try:
            # 记录原始输入
            logger.info(f"Original input - type: {location_type}, name: {location_name}")
            
            # 预处理参数：去除空格并处理URL编码字符
            location_type = location_type.strip()
            location_name = location_name.strip()
            logger.info(f"After strip - type: {location_type}, name: {location_name}")
            
            # 处理URL编码字符
            location_name = location_name.replace('%20', ' ')  # 处理空格
            location_name = location_name.replace('%2C', ',')  # 处理逗号
            location_name = location_name.replace('%2F', '/')  # 处理斜杠
            location_name = location_name.replace('%26', '&')  # 处理&符号
            logger.info(f"After URL decode - type: {location_type}, name: {location_name}")
            
            # 获取所有时间序列数据
            response = self.client.table(self.table_name)\
                .select('*')\
                .eq('location_type', location_type)\
                .eq('location_name', location_name)\
                .order('year_month')\
                .execute()
            
            logger.info(f"Query response data count: {len(response.data) if response.data else 0}")
                
            if not response.data:
                logger.error(f"No data found for {location_type} {location_name}")
                return {}
                
            # 处理时间序列数据
            dates = []
            values = []
            yoy_changes = []
            
            # 创建一个字典来存储每个年份的数据，用于计算同比变化
            yearly_data = {}
            for row in response.data:
                year_month = row['year_month']
                year = int(year_month.split('_')[0])
                month = int(year_month.split('_')[1])
                time_on_market = row.get('time_on_market')
                
                if year not in yearly_data:
                    yearly_data[year] = {}
                yearly_data[year][month] = time_on_market
            
            # 计算每个月的同比变化
            sorted_data = sorted(response.data, key=lambda x: x['year_month'])
            for row in sorted_data:
                year_month = row['year_month']
                dates.append(year_month)
                
                # 添加当前值（可以是 None）
                time_on_market = row.get('time_on_market')
                values.append(time_on_market)
                
                # 计算同比变化
                year = int(year_month.split('_')[0])
                month = int(year_month.split('_')[1])
                prev_year = year - 1
                
                if (time_on_market is not None and 
                    prev_year in yearly_data and 
                    month in yearly_data[prev_year] and 
                    yearly_data[prev_year][month] is not None and 
                    yearly_data[prev_year][month] != 0):
                    prev_value = yearly_data[prev_year][month]
                    yoy_change = ((time_on_market - prev_value) / prev_value) * 100
                else:
                    yoy_change = None
                
                yoy_changes.append(yoy_change)
            
            logger.info(f"Processed {len(dates)} data points for {location_type} {location_name}")
            
            return {
                'dates': dates,
                'time_on_market': {
                    'values': values,
                    'yoy_changes': yoy_changes
                }
            }
            
        except Exception as e:
            logger.error(f"Error getting time series data: {str(e)}")
            return {}
            
    def get_locations_by_type(self, location_type: str) -> List[Dict[str, str]]:
        """
        Get available locations for a specific type.
        
        Args:
            location_type: Type of location
            
        Returns:
            List of location dictionaries
        """
        try:
            response = self.client.table(self.locations_table)\
                .select('location_name')\
                .eq('location_type', location_type)\
                .execute()
                
            if response.data:
                return response.data
            return []
            
        except Exception as e:
            logger.error(f"Error getting locations: {str(e)}")
            return []
            
    def get_location_types(self) -> List[str]:
        """
        Get all available location types.
        
        Returns:
            List of location types
        """
        try:
            response = self.client.table(self.locations_table)\
                .select('location_type')\
                .execute()
                
            if response.data:
                # Get unique location types
                types = set(item['location_type'] for item in response.data)
                return sorted(list(types))
            return []
            
        except Exception as e:
            logger.error(f"Error getting location types: {str(e)}")
            return [] 