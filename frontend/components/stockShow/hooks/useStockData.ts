import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { fetchAllAggregatesUsingAxios, fetchValidPricesForTicker } from '../../../util/polygon_api_util';
import { getTickerQuery, Period } from '../../../util/util';
import { createSelector } from 'reselect';

export const useStockData = (ticker: string) => {
  // Refs for values that don't trigger re-renders
  const latestPrice = useRef<number>(0);
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);
  
  // Define the available ranges
  const ranges: Period[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];
  
  // Track the currently selected range
  const [selectedRange, setSelectedRange] = useState<Period>("1D");
  
  // Chart type state
  const [chartType, setChartType] = useState<'baseline' | 'candlestick'>('baseline');
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Cache the initial price value for each range
  const baselineValuesRef = useRef<Record<Period, number>>({
    "1D": 0, "1W": 0, "1M": 0, "3M": 0, "1Y": 0, "5Y": 0,
  });

  // Use a more efficient data structure with Map for better lookup performance
  const [stockPricesMap, setStockPricesMap] = useState<Map<Period, any[]>>(
    new Map(ranges.map(range => [range, []]))
  );

  // Track which ranges are loading with a Set for O(1) lookups
  const [loadingRanges, setLoadingRanges] = useState<Set<Period>>(new Set(ranges));

  // Convert Map to Record for easier component consumption - memoized to prevent unnecessary conversions
  const stockPrices = useMemo(() => {
    const result: Record<Period, any[]> = {} as Record<Period, any[]>;
    stockPricesMap.forEach((data, range) => {
      result[range] = data;
    });
    return result;
  }, [stockPricesMap]);

  // Create a selector for the current range data to avoid unnecessary rerenders
  const selectCurrentRangeData = useMemo(
    () => createSelector(
      () => stockPricesMap.get(selectedRange) || [],
      (data) => data
    ),
    [stockPricesMap, selectedRange]
  );

  // Fetch data for all ranges on ticker change
  useEffect(() => {
    let isMounted = true;
    
    const fetchAllRanges = async () => {
      if (!isMounted) return;
      
      // Clear previous data
      setStockPricesMap(new Map(ranges.map(range => [range, []])));
      setLoadingRanges(new Set(ranges));
      setError(null);

      // Create an array of fetch promises for each range
      const fetchPromises = ranges.map(async (range) => {
        try {
          let data: any[] = [];

          // Special case for 1D - use dedicated function to find most recent trading day
          if (range === "1D") {
            data = await fetchValidPricesForTicker(ticker);
          } else {
            const tq = getTickerQuery(ticker, range);
            data = await fetchAllAggregatesUsingAxios(
              ticker,
              Number(tq.timeFrame.split(" ")[0]),
              tq.timeFrame.split(" ")[1],
              tq.startDate,
              tq.endDate,
              {
                adjusted: "true",
                sort: "asc",
                limit: 5000,
              }
            );
          }

          if (!isMounted) return;
          
          if (data.length > 0) {
            // Store the first price as baseline
            baselineValuesRef.current[range] = data[0].c;

            // Update stock prices using functional update that maintains reference identity
            setStockPricesMap(prev => {
              const newMap = new Map(prev);
              newMap.set(range, data);
              return newMap;
            });

            // If this is the selected range, update latest price
            if (range === selectedRange && data.length > 0) {
              const latestItem = data[data.length - 1];
              if (latestItem && latestItem.c) {
                latestPrice.current = latestItem.c;
              }
            }
          }

          if (!isMounted) return;
          
          // Mark this range as loaded
          setLoadingRanges(prev => {
            const newSet = new Set(prev);
            newSet.delete(range);
            return newSet;
          });
        } catch (err) {
          console.error(`Error fetching ${range} aggregates:`, err);
          
          if (!isMounted) return;
          
          // Mark this range as loaded despite error
          setLoadingRanges(prev => {
            const newSet = new Set(prev);
            newSet.delete(range);
            return newSet;
          });
        }
      });

      // Wait for all ranges to be fetched
      await Promise.all(fetchPromises);
    };

    fetchAllRanges();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [ticker]);

  // Helper function to efficiently update stock price data for real-time updates - memoized to maintain reference
  const updateStockPrices = useCallback((range: Period, newDataPoint: any) => {
    setStockPricesMap(prev => {
      const currentData = prev.get(range) || [];
      
      // Check if we already have data for this timestamp to avoid duplicates
      const existingIndex = currentData.findIndex(
        item => item && item.t && Math.abs(item.t - newDataPoint.t) < 1000
      );
      
      let updatedData;
      if (existingIndex >= 0) {
        // Update existing point
        updatedData = [...currentData];
        updatedData[existingIndex] = newDataPoint;
      } else {
        // Add new point
        updatedData = [...currentData, newDataPoint];
      }
      
      // Create new map to ensure reference change triggers update
      const newMap = new Map(prev);
      newMap.set(range, updatedData);
      return newMap;
    });
  }, []);

  return {
    stockPrices,
    loadingRanges,
    selectedRange,
    setSelectedRange,
    chartType,
    setChartType,
    latestPrice,
    hoveredPrice,
    setHoveredPrice,
    baselineValuesRef,
    updateStockPrices,
    selectCurrentRangeData,
    error
  };
};