import React, { useEffect, useRef, useCallback, memo } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  BaselineSeries,
  CandlestickSeries,
  LineSeries,
  ColorType,
  CrosshairMode,
  DeepPartial,
  ChartOptions,
  UTCTimestamp,
  Time,
} from 'lightweight-charts';
import { Period } from '../../../util/util';
import { IndicatorKeys, TECHNICAL_INDICATORS } from '../../../constants/technical_indicators';
import {
  formatIndicatorData,
  convertToUTCSeconds,
  getMarketHoursTimestampRange,
  downsampleTimeSeriesData,
} from '../../../util/chart_util';

interface StockChartProps {
  ticker: string;
  selectedRange: Period;
  chartType: 'baseline' | 'candlestick';
  stockPrices: Record<Period, any[]>;
  loadingRanges: Set<Period>;
  activeIndicators: Set<IndicatorKeys>;
  technicalIndicators: Record<Period, Record<IndicatorKeys, any[]>>;
  baselineValuesRef: React.MutableRefObject<Record<Period, number>>;
  onHoverPriceChange: (price: number | null) => void;
  error: string | null;
  fetchIndicatorData: (indicator: IndicatorKeys, range: Period) => void;
}

// Update interfaces to use the library's Time type
interface LineChartPoint {
  time: Time;  // Use Time type from lightweight-charts
  value: number;
}

interface CandlestickChartPoint {
  time: Time;  // Use Time type from lightweight-charts
  open: number;
  high: number;
  low: number;
  close: number;
}

// Stock price data structure
interface StockPriceData {
  t: number;     // timestamp in milliseconds
  o?: number;    // open price (optional)
  h?: number;    // high price (optional)
  l?: number;    // low price (optional)
  c: number;     // close price
  v?: number;    // volume (optional)
}

// Indicator data structure
interface IndicatorData {
  [key: string]: any;
}

const StockChart: React.FC<StockChartProps> = memo(({
  ticker,
  selectedRange,
  chartType,
  stockPrices,
  loadingRanges,
  activeIndicators,
  technicalIndicators,
  baselineValuesRef,
  onHoverPriceChange,
  error,
  fetchIndicatorData
}) => {
  // Refs for chart container and chart instances
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const indicatorSeriesRefs = useRef<Record<IndicatorKeys, ISeriesApi<any> | null>>({
    RSI: null,
    MACD: null,
    SMA: null,
    EMA: null
  });
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const chartInitializedRef = useRef<boolean>(false);

  // Direct data processing without worker
  const processChartData = useCallback(
    (data: StockPriceData[], chartType: 'baseline' | 'candlestick'): LineChartPoint[] | CandlestickChartPoint[] => {
      if (!data || data.length === 0) return [];
      
      try {
        // Deep copy to avoid mutations
        const filteredData = JSON.parse(JSON.stringify(data)).filter(
          (d: StockPriceData) => d && typeof d.t !== 'undefined' && typeof d.c !== 'undefined'
        );
        
        if (filteredData.length === 0) return [];
        
        if (chartType === 'baseline') {
          // Format line chart data
          let lineData = filteredData.map((d: StockPriceData): LineChartPoint => {
            // Convert timestamp to UTC seconds
            const timeValue = Math.floor(d.t / 1000) as UTCTimestamp; // Simple conversion from milliseconds to seconds
            return {
              time: timeValue,
              value: d.c
            };
          });
          
          // Ensure unique times and sort
          const uniqueTimes = new Map<number, LineChartPoint>();
          lineData.forEach((point: LineChartPoint) => {
            uniqueTimes.set(point.time as UTCTimestamp, point);
          });
          
          lineData = Array.from(uniqueTimes.values());
          lineData.sort((a: LineChartPoint, b: LineChartPoint) => (a.time as number) - (b.time as number));
          
          console.log("First and last timestamps:", {
            first: lineData.length > 0 ? new Date(lineData[0].time * 1000).toLocaleString() : "none",
            last: lineData.length > 0 ? new Date(lineData[lineData.length - 1].time * 1000).toLocaleString() : "none"
          });
          
          return lineData;
        } else {
          // Format candlestick data
          let candleData = filteredData.map((d: StockPriceData): CandlestickChartPoint => {
            // Convert timestamp to UTC seconds
            const timeValue = Math.floor(d.t / 1000) as UTCTimestamp;; // Simple conversion from milliseconds to seconds
            return {
              time: timeValue,
              open: typeof d.o !== 'undefined' ? d.o : d.c,
              high: typeof d.h !== 'undefined' ? d.h : d.c,
              low: typeof d.l !== 'undefined' ? d.l : d.c,
              close: d.c
            };
          });
          
          // Ensure unique times and sort
          const uniqueTimes = new Map<number, CandlestickChartPoint>();
          candleData.forEach((point: CandlestickChartPoint) => {
            uniqueTimes.set(point.time as UTCTimestamp, point);
          });
          
          candleData = Array.from(uniqueTimes.values());
          candleData.sort((a: CandlestickChartPoint, b: CandlestickChartPoint) => (a.time as number) - (b.time as number));
          
          console.log("First and last timestamps:", {
            first: candleData.length > 0 ? new Date(candleData[0].time * 1000).toLocaleString() : "none",
            last: candleData.length > 0 ? new Date(candleData[candleData.length - 1].time * 1000).toLocaleString() : "none"
          });
          
          return candleData;
        }
      } catch (error) {
        console.error('Error processing chart data:', error);
        return [];
      }
    },
    []
  );
  
  // Direct indicator data processing
  const processIndicatorData = useCallback(
    (
      indicator: IndicatorKeys, 
      indicatorData: IndicatorData[], 
      priceData: StockPriceData[]
    ): LineChartPoint[] => {
      try {
        // Use the existing formatIndicatorData utility
        const formattedData = formatIndicatorData(indicatorData, indicator, priceData) as LineChartPoint[];
        return formattedData;
      } catch (error) {
        console.error(`Error processing indicator data for ${indicator}:`, error);
        return [];
      }
    }, 
    []
  );

  // Add indicator series to chart
  const addIndicatorSeries = useCallback((indicator: IndicatorKeys) => {
    if (!chartRef.current || !chartInitializedRef.current) return;

    // Get indicator data for the current range
    const indicatorData = technicalIndicators?.[selectedRange]?.[indicator];
    if (!indicatorData || !Array.isArray(indicatorData) || indicatorData.length === 0) {
      // If data isn't loaded yet, fetch it
      fetchIndicatorData(indicator, selectedRange);
      return;
    }

    // Remove existing series if it exists
    if (indicatorSeriesRefs.current[indicator]) {
      try {
        chartRef.current.removeSeries(indicatorSeriesRefs.current[indicator]!);
        indicatorSeriesRefs.current[indicator] = null;
      } catch (error) {
        console.error(`Error removing existing indicator series for ${indicator}:`, error);
      }
    }

    try {
      // Create a series for the indicator
      const series = chartRef.current.addSeries(LineSeries, {
        color: TECHNICAL_INDICATORS[indicator].color,
        lineWidth: 2,
        lastValueVisible: true,
        priceLineVisible: false,
        title: TECHNICAL_INDICATORS[indicator].name,
        priceScaleId: `${indicator}-scale`, // Use separate scale for each indicator
      });

      // Configure a separate price scale for this indicator to avoid interference
      chartRef.current.priceScale(`${indicator}-scale`).applyOptions({
        scaleMargins: {
          top: 0.3,
          bottom: 0.05,
        },
        visible: false, // Hide the separate scale to avoid clutter
      });

      // Process data directly without worker
      const priceData = stockPrices[selectedRange] || [];
      const formattedData = processIndicatorData(indicator, indicatorData, priceData);
      
      // Filter out invalid values
      const safeData = formattedData.filter((point) =>
        point &&
        point.time !== null && point.time !== undefined &&
        point.value !== null && point.value !== undefined &&
        !Number.isNaN(point.value)
      );

      if (safeData.length > 0) {
        series.setData(safeData);
        indicatorSeriesRefs.current[indicator] = series;
      } else {
        // If no valid data points after filtering, remove the series
        chartRef.current.removeSeries(series);
        console.warn(`No valid data points for ${indicator} after filtering`);
      }
    } catch (error) {
      console.error(`Error adding indicator series for ${indicator}:`, error);
    }
  }, [selectedRange, fetchIndicatorData, technicalIndicators, processIndicatorData, stockPrices]);

  // Clean up chart when component unmounts
  useEffect(() => {
    return () => {
      if (resizeObserverRef.current && chartContainerRef.current) {
        resizeObserverRef.current.unobserve(chartContainerRef.current);
        resizeObserverRef.current = null;
      }
      
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        mainSeriesRef.current = null;
      }
      
      chartInitializedRef.current = false;
      
      // Clear all indicator series refs
      Object.keys(indicatorSeriesRefs.current).forEach(key => {
        indicatorSeriesRefs.current[key as IndicatorKeys] = null;
      });
    };
  }, []);

  // Create or update the chart when range or chart type changes
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const currentData = stockPrices[selectedRange];
    const isDataLoaded = currentData && currentData.length > 0;
    const isRangeLoading = loadingRanges.has(selectedRange);

    console.log(`Chart data for ${selectedRange}:`, {
      dataLength: currentData?.length || 0,
      isDataLoaded,
      isRangeLoading,
      firstItem: currentData?.[0],
      lastItem: currentData?.length > 0 ? currentData[currentData.length - 1] : null
    });

    // Clean up any existing chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      mainSeriesRef.current = null;
      chartInitializedRef.current = false;

      // Reset indicator series refs
      Object.keys(indicatorSeriesRefs.current).forEach(key => {
        indicatorSeriesRefs.current[key as IndicatorKeys] = null;
      });
    }

    // Reset hovered price
    onHoverPriceChange(null);

    // Chart options with proper time formatting for EST
    const chartOptions: DeepPartial<ChartOptions> = {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: {
          type: ColorType.Solid,
          color: '#151924' // Dark background
        },
        textColor: '#D9D9D9', // Light text color for dark background
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: selectedRange === "1D", // Show seconds only for 1D view
        tickMarkFormatter: (time: UTCTimestamp, tickMarkType: any, locale: any) => {
          // Format time as EST
          const date = new Date(time * 1000);

          // For 1D view, show hour and minute only
          if (selectedRange === "1D") {
            return date.toLocaleString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              timeZone: 'America/New_York'
            });
          }

          // For other views, show date
          return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'America/New_York'
          });
        },
        borderColor: '#333',
      },
      grid: {
        vertLines: {
          color: 'rgba(70, 70, 70, 0.2)', // Make vertical grid lines visible
        },
        horzLines: {
          color: 'rgba(70, 70, 70, 0.2)', // Make horizontal grid lines visible
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#6A5ACD',
          width: 1,
          style: 0,
          labelBackgroundColor: '#6A5ACD',
          visible: true,
          labelVisible: true,
        },
        horzLine: {
          visible: true, // Show horizontal crosshair
          color: '#6A5ACD',
          labelBackgroundColor: '#6A5ACD',
        },
      },
      rightPriceScale: {
        borderColor: '#333',
        scaleMargins: {
          top: 0.3, // Add more space at the top for tooltip
          bottom: 0.05,
        },
        visible: true,
      },
      localization: {
        timeFormatter: (time: UTCTimestamp): string => {
          const date = new Date(time * 1000);
          return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: selectedRange === "1D" ? '2-digit' : undefined,
            hour12: true,
            timeZone: 'America/New_York'
          });
        },
      },
    };

    try {
      // Create a new chart
      chartRef.current = createChart(chartContainerRef.current, chartOptions);
      chartInitializedRef.current = true;

      // Add crosshair move handler to update price display when hovering
      chartRef.current.subscribeCrosshairMove(param => {
        if (param.point === undefined || !param.time || param.point.x < 0 || param.point.y < 0) {
          // Reset to latest price when cursor leaves the chart
          onHoverPriceChange(null);
          return;
        }

        // Find the price at this time
        if (mainSeriesRef.current) {
          try {
            const point = param.seriesData.get(mainSeriesRef.current);
            if (point) {
              // For candlestick series, we get OHLC data
              if (chartType === 'candlestick' && 'close' in point) {
                onHoverPriceChange(point.close);
              }
              // For baseline series, we get a simple value
              else if ('value' in point) {
                onHoverPriceChange(point.value);
              }
            }
          } catch (error) {
            console.error('Error in crosshair move handler:', error);
          }
        }
      });

      // Create the appropriate series based on chart type
      if (chartType === 'baseline') {
        // Create a baseline series
        mainSeriesRef.current = chartRef.current.addSeries(BaselineSeries, {
          baseValue: {
            type: 'price',
            price: baselineValuesRef.current[selectedRange] || 0 // Use the first price as baseline
          },
          topLineColor: 'rgba(38, 166, 154, 1)',
          topFillColor1: 'rgba(38, 166, 154, 0.28)',
          topFillColor2: 'rgba(38, 166, 154, 0.05)',
          bottomLineColor: 'rgba(239, 83, 80, 1)',
          bottomFillColor1: 'rgba(239, 83, 80, 0.05)',
          bottomFillColor2: 'rgba(239, 83, 80, 0.28)',
          lastValueVisible: true,
          priceLineVisible: true,
        });
      } else {
        // Create a candlestick series
        mainSeriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
          lastValueVisible: true,
          priceLineVisible: true,
        });
      }

      // Setup resize observer
      resizeObserverRef.current = new ResizeObserver(entries => {
        const { width } = entries[0].contentRect;
        if (chartRef.current) {
          chartRef.current.applyOptions({ width });
        }
      });

      if (chartContainerRef.current) {
        resizeObserverRef.current.observe(chartContainerRef.current);
      }

      // Add price data if we have it
      if (isDataLoaded && !isRangeLoading) {
        // Process data directly without worker
        const processedData = processChartData(currentData, chartType);
        console.log("Processed data summary:", {
          length: processedData.length,
          firstThree: processedData.slice(0, 3),
          lastThree: processedData.slice(-3)
        });
        
        if (processedData.length > 0 && mainSeriesRef.current) {
          // Set the data
          mainSeriesRef.current.setData(processedData);
          
          // Always fit content first to make sure we see all data
          chartRef.current.timeScale().fitContent();
          
          // For 1D view, if we want to show specific hours, we can set a visible range
          // but for now let's just show all data
          if (selectedRange === "1D" && chartRef.current) {
            // Let's not use getMarketHoursTimestampRange() for now as it might be restricting the view
            // Instead, just fit all content to show entire day's data
            
            // If we still want to specify a range, calculate it from the actual data:
            if (processedData.length >= 2) {
              const startTime = processedData[0].time;
              const endTime = processedData[processedData.length - 1].time;
              console.log("Setting visible range from data:", { startTime, endTime });
              
              // Add padding to ensure we see everything
              const padding = ((endTime as number) - (startTime as number)) * 0.05; // 5% padding
              chartRef.current.timeScale().setVisibleRange({
                from: ((startTime as number) - padding) as UTCTimestamp,
                to: ((endTime as number) + padding) as UTCTimestamp
              });
            }
          }
          
          // Add active indicators
          activeIndicators.forEach(indicator => {
            addIndicatorSeries(indicator);
          });
        }
      }
    } catch (error) {
      console.error("Error creating or updating chart:", error);
    }
  }, [selectedRange, chartType, stockPrices, loadingRanges, processChartData, onHoverPriceChange, activeIndicators, addIndicatorSeries]);

  // Update indicator series when activeIndicators changes
  useEffect(() => {
    if (!chartRef.current || !mainSeriesRef.current || !chartInitializedRef.current) return;

    // For each indicator, add or remove the series as needed
    Object.keys(TECHNICAL_INDICATORS).forEach(key => {
      const indicator = key as IndicatorKeys;
      const isActive = activeIndicators.has(indicator);

      if (isActive) {
        // Add series if it doesn't exist
        if (!indicatorSeriesRefs.current[indicator]) {
          addIndicatorSeries(indicator);
        }
      } else {
        // Remove series if it exists
        if (indicatorSeriesRefs.current[indicator] && chartRef.current) {
          try {
            chartRef.current.removeSeries(indicatorSeriesRefs.current[indicator]!);
            indicatorSeriesRefs.current[indicator] = null;
          } catch (error) {
            console.error(`Error removing indicator series for ${indicator}:`, error);
          }
        }
      }
    });
  }, [activeIndicators, addIndicatorSeries]);

  return (
    <div
      ref={chartContainerRef}
      className="chart-container"
      style={{ position: 'relative', height: '500px' }}
    >
      {(loadingRanges.has(selectedRange) || 
        (activeIndicators.size > 0 && 
         Array.from(activeIndicators).some(indicator => 
           !technicalIndicators?.[selectedRange]?.[indicator] || 
           technicalIndicators[selectedRange][indicator].length === 0
         ))
      ) && (
        <div className="loading-overlay">
          Loading data...
        </div>
      )}

      {error && !loadingRanges.has(selectedRange) && 
       (!stockPrices[selectedRange] || stockPrices[selectedRange].length === 0) && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
});

export default StockChart;