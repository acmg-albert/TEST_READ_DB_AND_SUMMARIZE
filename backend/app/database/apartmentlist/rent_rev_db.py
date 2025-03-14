"""
Rent Rev database client module.
Handles database operations for apartment rent estimates data.
"""

import logging
from typing import List, Dict, Any, Optional
from ..base import BaseDBClient

# Configure logging
logger = logging.getLogger(__name__)

class RentRevDBClient(BaseDBClient):
    """Database client for rent estimates data."""
    
    def __init__(self):
        """Initialize database client."""
        super().__init__()
        self.table_name = 'apartment_list_rent_estimates_view'
        self.summary_table = 'apartment_list_rent_estimates_summary_view'
        self.locations_table = 'apartment_list_rent_estimates_unique_locations_view'
        
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
        Get rent data for locations of specified type.
        
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
            values = {'overall': [], '1br': [], '2br': []}
            yoy_changes = {'overall': [], '1br': [], '2br': []}
            
            # 创建一个字典来存储每个年份的数据，用于计算同比变化
            yearly_data = {'overall': {}, '1br': {}, '2br': {}}
            
            for row in response.data:
                year_month = row['year_month']
                year = int(year_month.split('_')[0])
                month = int(year_month.split('_')[1])
                
                # 处理每种租金类型的数据
                rent_types = {
                    'overall': 'rent_estimate_overall',
                    '1br': 'rent_estimate_1br',
                    '2br': 'rent_estimate_2br'
                }
                
                for rent_type, column in rent_types.items():
                    rent_value = row.get(column)
                    if rent_value is not None:
                        if year not in yearly_data[rent_type]:
                            yearly_data[rent_type][year] = {}
                        yearly_data[rent_type][year][month] = rent_value
            
            # 计算每个月的同比变化
            sorted_data = sorted(response.data, key=lambda x: x['year_month'])
            for row in sorted_data:
                year_month = row['year_month']
                year = int(year_month.split('_')[0])
                month = int(year_month.split('_')[1])
                
                # 只在处理第一种租金类型时添加日期
                dates.append(year_month)
                
                # 处理每种租金类型的数据
                for rent_type, column in rent_types.items():
                    rent_value = row.get(column)
                    if rent_value is not None:
                        values[rent_type].append(rent_value)
                        
                        # 计算同比变化
                        prev_year = year - 1
                        if (prev_year in yearly_data[rent_type] and 
                            month in yearly_data[rent_type][prev_year]):
                            prev_value = yearly_data[rent_type][prev_year][month]
                            if prev_value != 0:  # 避免除以0
                                yoy_change = ((rent_value - prev_value) / prev_value) * 100
                            else:
                                yoy_change = 0
                        else:
                            yoy_change = 0
                        
                        yoy_changes[rent_type].append(yoy_change)
                    else:
                        values[rent_type].append(None)
                        yoy_changes[rent_type].append(None)
            
            logger.info(f"Processed {len(dates)} data points for {location_type} {location_name}")
            
            return {
                'dates': dates,
                'rent_estimate': {
                    'values': values['overall'],
                    'yoy_changes': yoy_changes['overall']
                },
                'rent_estimate_1br': {
                    'values': values['1br'],
                    'yoy_changes': yoy_changes['1br']
                },
                'rent_estimate_2br': {
                    'values': values['2br'],
                    'yoy_changes': yoy_changes['2br']
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
            # 直接返回所有支持的location types
            location_types = ["National", "State", "Metro", "City", "County"]
            return location_types
            
        except Exception as e:
            logger.error(f"Error getting location types: {str(e)}")
            return [] 