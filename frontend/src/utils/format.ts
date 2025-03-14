/**
 * Format date string
 * @param dateStr Date string in 'YYYY-MM' format
 * @returns Formatted date string, e.g., 'March 2024'
 */
export const formatDate = (dateStr: string): string => {
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

/**
 * Format percentage value
 * @param value Number to format
 * @returns Formatted percentage string, e.g., '+12.34%' or '-12.34%'
 */
export const formatPercent = (value: number): string => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${(value * 100).toFixed(2)}%`;
}; 