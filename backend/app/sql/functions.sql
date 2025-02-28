-- 获取最新的N个月份
CREATE OR REPLACE FUNCTION get_latest_months(
    table_name text,
    month_count integer
)
RETURNS TABLE (year_month text) AS $$
BEGIN
    RETURN QUERY EXECUTE format(
        'SELECT DISTINCT year_month 
         FROM %I 
         ORDER BY year_month DESC 
         LIMIT $1',
        table_name
    ) USING month_count;
END;
$$ LANGUAGE plpgsql;

-- 获取特定类型的所有不同地区
CREATE OR REPLACE FUNCTION get_distinct_locations(
    table_name text,
    loc_type text
)
RETURNS TABLE (location_name text) AS $$
BEGIN
    RETURN QUERY EXECUTE format(
        'SELECT DISTINCT location_name 
         FROM %I 
         WHERE location_type = $1
         ORDER BY location_name',
        table_name
    ) USING loc_type;
END;
$$ LANGUAGE plpgsql; 