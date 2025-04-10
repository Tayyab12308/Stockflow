import { Time, BusinessDay, UTCTimestamp } from "lightweight-charts";
import { IndicatorKeys } from "../constants/technical_indicators";

/**
 * Check if a date is in Daylight Saving Time
 */
export const isDaylightSavingTime = (date: Date): boolean => {
  // Create two dates: Jan 1 (always standard time) and Jul 1 (always daylight time)
  const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();

  // If they're different, determine which one applies based on current date
  return date.getTimezoneOffset() === Math.min(jan, jul);
};

/**
 * Convert UTC timestamp to EST timestamp
 * @returns Timestamp as seconds (unix timestamp)
 */
export const convertToUTCSeconds = (timestamp: number): number => {
  // Convert to seconds if in milliseconds
  return timestamp > 1000000000000 ? Math.floor(timestamp / 1000) : timestamp;
};

/**
 * Get today's fixed market hours (4:00 AM to 8:00 PM EST) as timestamp range
 * @returns Range object with from and to timestamps
 */
export const getMarketHoursTimestampRange = (): { from: UTCTimestamp; to: UTCTimestamp } => {
  const today = new Date();
  const estOffset = isDaylightSavingTime(today) ? -4 : -5; // EDT: -4, EST: -5
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const marketOpenUTC = new Date(todayUTC.getTime() + (4 - estOffset) * 3600000); // 4 AM EST in UTC
  const marketCloseUTC = new Date(todayUTC.getTime() + (20 - estOffset) * 3600000); // 8 PM EST in UTC
  return {
    from: Math.floor(marketOpenUTC.getTime() / 1000) as UTCTimestamp,
    to: Math.floor(marketCloseUTC.getTime() / 1000) as UTCTimestamp,
  };
};

/**
 * Format price for display
 */
export const formatPrice = (price: number | string | null | undefined): string => {
  if (price === null || price === undefined) return "0.00";
  const numericPrice = typeof price === "number" ? price : parseFloat(price);
  return isNaN(numericPrice) ? "0.00" : numericPrice.toFixed(2);
};

/**
 * Downsample high-frequency data to prevent overcrowding
 * For second-level data, this function samples points to get approximately
 * one point per minute to make the chart more readable
 */
export const downsampleTimeSeriesData = <T extends { time: Time, [key: string]: any }>(
  data: T[],
  targetPointCount: number = 1000 // One trading day (6.5 hours = 390 minutes)
): T[] => {
  if (!data || data.length <= targetPointCount) return data;

  // Calculate sampling interval
  const samplingInterval = Math.ceil(data.length / targetPointCount);

  // Sample the data
  const sampledData: T[] = [];
  for (let i = 0; i < data.length; i += samplingInterval) {
    sampledData.push(data[i]);
  }

  // Always include the last point
  if (sampledData.length > 0 && data.length > 0 &&
    sampledData[sampledData.length - 1] !== data[data.length - 1]) {
    sampledData.push(data[data.length - 1]);
  }

  return sampledData;
};

/**
 * Format indicator data for chart display with robust null handling
 */
export const formatIndicatorData = (
  indicatorData: any[],
  indicator: IndicatorKeys,
  priceData: any[]
): { time: Time, value: number }[] => {
  if (!indicatorData || !Array.isArray(indicatorData) || indicatorData.length === 0) {
    return [];
  }

  const formattedData: { time: Time, value: number }[] = [];

  // Process data based on indicator type
  indicatorData.forEach(item => {
    if (!item) return;

    let value: number | null | undefined;
    let timestamp = item.timestamp || item.t;

    if (!timestamp) return;

    // Extract the appropriate value based on indicator type
    switch (indicator) {
      case 'RSI':
        value = item.value;
        break;
      case 'MACD':
        value = item.macd;
        break;
      case 'SMA':
      case 'EMA':
        value = item.value;
        break;
      default:
        value = item.value;
    }

    // Skip any null or undefined or NaN values
    if (value === null || value === undefined || Number.isNaN(value)) {
      return;
    }

    // Convert timestamp to EST
    const estTimestamp = convertToUTCSeconds(timestamp);

    // Only add points within market hours
    formattedData.push({
      time: estTimestamp as Time,
      value: value
    });
  });

  // Sort by time to ensure proper sequence
  return formattedData.sort((a, b) => (a.time as number) - (b.time as number));
};

/**
 * Get the desired market hours range for a 1D view.
 * Updated here to produce a range from 4:00 AM to 8:00 PM EST.
 */
export const getFullMarketHoursRange = (): { from: UTCTimestamp; to: UTCTimestamp } => {
  const today = new Date();
  // Determine EST offset (use your existing isDaylightSavingTime function)
  const estOffset = isDaylightSavingTime(today) ? -4 : -5;

  // Create a Date object for 4:00 AM EST today:
  const marketOpen = new Date(today);
  marketOpen.setHours(4 - estOffset, 0, 0, 0);

  // Create a Date object for 8:00 PM EST today:
  const marketClose = new Date(today);
  marketClose.setHours(20 - estOffset, 0, 0, 0);

  return {
    from: Math.floor(marketOpen.getTime() / 1000) as UTCTimestamp,
    to: Math.floor(marketClose.getTime() / 1000) as UTCTimestamp,
  };
};