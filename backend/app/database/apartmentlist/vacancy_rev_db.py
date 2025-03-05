"""
Vacancy Rev database client module.
Handles database operations for apartment vacancy rate data.
"""

import logging
from typing import List, Dict, Any, Optional
from ..base import BaseDBClient

# Configure logging
logger = logging.getLogger(__name__)

class VacancyRevDBClient(BaseDBClient):
    """Database client for vacancy rate data."""
    
    def __init__(self):
        """Initialize database client."""
        super().__init__()
        self.table_name = 'apartment_list_vacancy_index_view'
        self.summary_table = 'apartment_list_vacancy_index_summary_view'
        self.locations_table = 'apartment_list_vacancy_unique_locations_view'
        
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
        Get vacancy data for locations of specified type.
        
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
                vacancy_index = row.get('vacancy_index')
                # 只跳过None/null值，但接受0值
                if vacancy_index is not None:
                    year_month = row['year_month']
                    year = int(year_month.split('_')[0])
                    month = int(year_month.split('_')[1])
                    
                    if year not in yearly_data:
                        yearly_data[year] = {}
                    yearly_data[year][month] = vacancy_index
            
            # 计算每个月的同比变化
            sorted_data = sorted(response.data, key=lambda x: x['year_month'])
            for row in sorted_data:
                vacancy_index = row.get('vacancy_index')
                if vacancy_index is not None:  # 同样只跳过None/null值
                    year_month = row['year_month']
                    year = int(year_month.split('_')[0])
                    month = int(year_month.split('_')[1])
                    
                    # 添加日期和当前值
                    dates.append(year_month)
                    values.append(vacancy_index)
                    
                    # 计算同比变化
                    prev_year = year - 1
                    if prev_year in yearly_data and month in yearly_data[prev_year]:
                        prev_value = yearly_data[prev_year][month]
                        if prev_value != 0:  # 避免除以0
                            yoy_change = ((vacancy_index - prev_value) / prev_value) * 100
                        else:
                            yoy_change = 0
                    else:
                        yoy_change = 0
                    
                    yoy_changes.append(yoy_change)
            
            logger.info(f"Processed {len(dates)} data points for {location_type} {location_name}")
            
            return {
                'dates': dates,
                'vacancy_index': {
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