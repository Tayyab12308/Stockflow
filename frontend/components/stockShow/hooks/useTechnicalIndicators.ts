import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getTickerQuery, Period } from '../../../util/util';
import { IndicatorKeys, TECHNICAL_INDICATORS } from '../../../constants/technical_indicators';
import { fetchTechnicalIndicator, fetchTechnicalIndicatorWithRetry } from '../../../util/polygon_api_util';

export const useTechnicalIndicators = (
  ticker: string, 
  stockPrices: Record<Period, any[]>,
  selectedRange: Period
) => {
  // Available ranges
  const ranges: Period[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

  // State for active technical indicators
  const [activeIndicators, setActiveIndicators] = useState<Set<IndicatorKeys>>(new Set());
  
  // Track which indicators are loading
  const [loadingIndicators, setLoadingIndicators] = useState<Set<IndicatorKeys>>(new Set());

  // State to store technical indicators data per range - using Map for better performance
  const [indicatorsData, setIndicatorsData] = useState<Map<Period, Map<IndicatorKeys, any[]>>>(
    new Map(ranges.map(range => [
      range, 
      new Map(Object.keys(TECHNICAL_INDICATORS).map(key => [key as IndicatorKeys, []]))
    ]))
  );

  // Convert to the format expected by components - PROPERLY MEMOIZED
  const technicalIndicators = useMemo(() => {
    const result: Record<Period, Record<IndicatorKeys, any[]>> = {} as Record<Period, Record<IndicatorKeys, any[]>>;
    
    indicatorsData.forEach((rangeData, range) => {
      result[range] = {} as Record<IndicatorKeys, any[]>;
      rangeData.forEach((data, indicator) => {
        result[range][indicator] = data;
      });
    });
    
    return result;
  }, [indicatorsData]);

  // Toggle an indicator
  const toggleIndicator = useCallback((indicator: IndicatorKeys) => {
    setActiveIndicators(prev => {
      const newSet = new Set(prev);
      if (newSet.has(indicator)) {
        newSet.delete(indicator);
      } else {
        newSet.add(indicator);
        
        // Fetch indicator data for all ranges if not already loaded
        ranges.forEach(range => {
          const indicatorData = indicatorsData.get(range)?.get(indicator) || [];
          if (indicatorData.length === 0) {
            fetchIndicatorData(indicator, range);
          }
        });
      }
      return newSet;
    });
  }, [indicatorsData]);

  // Fetch technical indicator data
  const fetchIndicatorData = useCallback(async (indicator: IndicatorKeys, range: Period) => {
    // Skip if already loaded or already loading
    const existingData = indicatorsData.get(range)?.get(indicator) || [];
    if (existingData.length > 0 || loadingIndicators.has(indicator)) return;

    // Mark as loading
    setLoadingIndicators(prev => {
      const newSet = new Set(prev);
      newSet.add(indicator);
      return newSet;
    });

    try {
      let indicatorData = [];

      // Special case for 1D - use retry logic to find most recent trading day
      if (range === "1D") {
        const indicatorConfig = TECHNICAL_INDICATORS[indicator];
        indicatorData = await fetchTechnicalIndicatorWithRetry(
          ticker,
          indicatorConfig.endpoint,
          5, // Max attempts
          indicatorConfig.params
        );
      } else {
        const tq = getTickerQuery(ticker, range);
        let timespan = tq.timeFrame.split(" ")[1];
        let multiplier = Number(tq.timeFrame.split(" ")[0]);

        // Fetch indicator data
        const indicatorConfig = TECHNICAL_INDICATORS[indicator];
        indicatorData = await fetchTechnicalIndicator(
          ticker,
          indicatorConfig.endpoint,
          multiplier,
          timespan,
          tq.startDate,
          tq.endDate,
          indicatorConfig.params
        );
      }

      // Update state with function to ensure we have latest state
      setIndicatorsData(prev => {
        const newMap = new Map(prev);
        const rangeMap = new Map(newMap.get(range) || []);
        rangeMap.set(indicator, indicatorData);
        newMap.set(range, rangeMap);
        return newMap;
      });
    } catch (error) {
      console.error(`Error fetching ${indicator} for ${range}:`, error);
    } finally {
      // Mark as no longer loading
      setLoadingIndicators(prev => {
        const newSet = new Set(prev);
        newSet.delete(indicator);
        return newSet;
      });
    }
  }, [ticker]); // Only depend on ticker to avoid recreation

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup function to prevent memory leaks
      setLoadingIndicators(new Set());
    };
  }, []);

  return {
    technicalIndicators,
    activeIndicators,
    setActiveIndicators,
    loadingIndicators,
    toggleIndicator,
    fetchIndicatorData
  };
};
