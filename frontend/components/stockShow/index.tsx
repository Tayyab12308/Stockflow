import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import PriceOdometer from "../odometer";
import { PolygonWebsocketService } from "../../websocket/polygonWebsocketService";
import { convertKeysToCamelCase, formatNumber, getTickerQuery, Period, timeSince } from "../../util/util";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  Time,
  BaselineSeries,
  ColorType,
  CandlestickSeries,
  LineSeries,
  CrosshairMode,
  DeepPartial,
  ChartOptions,
  UTCTimestamp,
} from "lightweight-charts";
import News from "../news";
import {
  fetchAllAggregatesUsingAxios,
  fetchTechnicalIndicator,
  fetchTechnicalIndicatorWithRetry,
  fetchValidPricesForTicker,
  fetchTickerNews
} from "../../util/polygon_api_util";
import { TECHNICAL_INDICATORS, IndicatorKeys } from "../../constants/technical_indicators";
import {
  formatIndicatorData,
  formatPrice,
  convertToUTCSeconds,
  isWithinMarketHours,
  getMarketHoursTimestampRange,
  downsampleTimeSeriesData,
  getFullMarketHoursRange
} from "../../util/chart_util";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers/root_reducer";
import { addToWatchlist, createTransaction, deleteFromWatchlist } from "../../actions/session_actions";
import Odometer from "../odometer";
import { fetchCompany, fetchCompanyProfile, fetchKeyStats } from "../../util/stock_api_util";
import { OrderType, TransactionParams, WatchlistParams } from "../../interfaces";
import { AppDispatch } from "../../store";
import { User, WatchListResponse } from "../../interfaces/user.interface";
import assetService from "../../services/assetService";

type ChartType = 'baseline' | 'candlestick';

const StockShow = () => {
  const { ticker } = useParams<{ ticker: string }>();
  if (!ticker) return <>No Ticker Found</>;

  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => convertKeysToCamelCase(Object.values(state.entities.users)[0]) as User);

  // Define the available ranges
  const ranges: Period[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];
  // Track the currently selected range
  const [selectedRange, setSelectedRange] = useState<Period>("1D");
  // State to store fetched stock price aggregates per range
  const [stockPrices, setStockPrices] = useState<Record<Period, any[]>>({
    "1D": [],
    "1W": [],
    "1M": [],
    "3M": [],
    "1Y": [],
    "5Y": [],
  });
  // Track which ranges are loading
  const [loadingRanges, setLoadingRanges] = useState<Set<Period>>(new Set(ranges));
  // State to store latest price for the odometer
  const [latestPrice, setLatestPrice] = useState<number>(0);
  // State to store ticker news
  const [tickerNews, setTickerNews] = useState<React.JSX.Element[]>([]);
  // State to store error messages
  const [error, setError] = useState<string | null>(null);
  // State for chart type
  const [chartType, setChartType] = useState<ChartType>('baseline');
  // State for active technical indicators
  const [activeIndicators, setActiveIndicators] = useState<Set<IndicatorKeys>>(new Set());
  // State to store technical indicators data per range
  const [technicalIndicators, setTechnicalIndicators] = useState<Record<Period, Record<IndicatorKeys, any[]>>>({
    "1D": { RSI: [], MACD: [], SMA: [], EMA: [] },
    "1W": { RSI: [], MACD: [], SMA: [], EMA: [] },
    "1M": { RSI: [], MACD: [], SMA: [], EMA: [] },
    "3M": { RSI: [], MACD: [], SMA: [], EMA: [] },
    "1Y": { RSI: [], MACD: [], SMA: [], EMA: [] },
    "5Y": { RSI: [], MACD: [], SMA: [], EMA: [] },
  });
  // Track which indicators are loading
  const [loadingIndicators, setLoadingIndicators] = useState<Set<IndicatorKeys>>(new Set());

  // Track which indicator is being displayed in the dropdown
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Track the hovered price for odometer
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);

  const [companyProfile, setCompanyProfile] = useState<{ [x: string]: any }>({});
  const [info, setInfo] = useState<{ [x: string]: any }>({});
  const [keyStats, setKeyStats] = useState<{ [x: string]: any }>({});

  const [form, setForm] = useState({ shares: "" });
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);
  const [orderType, setOrderType] = useState<OrderType>("BUY");
  const [errors, setErrors] = useState<React.JSX.Element | null>(null);
  const [success, setSuccess] = useState<React.JSX.Element | null>(null);
  const [addedToWatchlist, setAddedToWatchlist] = useState<React.JSX.Element | null>(null);
  const [removeWatchlistClicked, setRemoveWatchlistClicked] = useState(0);
  const [removeWatchlistMessage, setRemoveWatchlistMesssage] = useState<React.JSX.Element | null>(null);

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

  // Cache the initial price value for each range
  const baselineValuesRef = useRef<Record<Period, number>>({
    "1D": 0,
    "1W": 0,
    "1M": 0,
    "3M": 0,
    "1Y": 0,
    "5Y": 0,
  });

  // --- Toggle indicator selection ---
  const toggleIndicator = (indicator: IndicatorKeys) => {
    const newActiveIndicators = new Set(activeIndicators);
    if (newActiveIndicators.has(indicator)) {
      newActiveIndicators.delete(indicator);
    } else {
      newActiveIndicators.add(indicator);

      // Fetch indicator data for all ranges if not already loaded
      ranges.forEach(range => {
        if (technicalIndicators[range][indicator].length === 0) {
          fetchIndicatorData(indicator, range);
        }
      });
    }
    setActiveIndicators(newActiveIndicators);
  };

  // --- Fetch technical indicator data ---
  const fetchIndicatorData = async (indicator: IndicatorKeys, range: Period) => {
    if (technicalIndicators[range][indicator].length > 0) return; // Already loaded

    setLoadingIndicators(prev => new Set(prev).add(indicator));

    try {
      let indicatorData = [];

      // Special case for 1D - use the retry logic to find the most recent trading day
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

      // Update state
      setTechnicalIndicators(prev => {
        const updatedState = { ...prev };
        updatedState[range][indicator] = indicatorData;
        return updatedState;
      });
    } catch (error) {
      console.error(`Error fetching ${indicator} for ${range}:`, error);
    } finally {
      setLoadingIndicators(prev => {
        const newSet = new Set(prev);
        newSet.delete(indicator);
        return newSet;
      });
    }
  };

  // Check if ticker is in user's watchlist
  const checkInWatchlist = useCallback(() => {
    const watchlistSymbols = user.watchlist.map((el: WatchListResponse) => el.tickerSymbol);
    setInWatchlist(watchlistSymbols.includes(ticker));
  }, [user, ticker])

  // --- Fetch company info, key stats, and news ---
  useEffect(() => {
    fetchCompany(ticker).then(res => setInfo(res));
    fetchKeyStats(ticker).then(res => setKeyStats(res["Global Quote"]));
    fetchCompanyProfile(ticker).then(companyProfileRes => {
      setCompanyProfile(companyProfileRes[0]);
    })

    checkInWatchlist();
  }, [ticker, dispatch])

  // --- Fetch ticker news using axios ---
  useEffect(() => {
    fetchTickerNews(ticker)
      .then((newsData) => {
        const newsItems = newsData.map((news: any, idx: number) => {
          const { publisher, image_url, title, tickers, published_utc, article_url } = news;
          return (
            <News
              key={idx}
              publisher={publisher?.name || ""}
              title={title || ""}
              imageUrl={image_url || ""}
              tickers={tickers || []}
              url={article_url || ""}
              time={timeSince(published_utc)}
              shouldDisplayTicker={false}
            />
          );
        });
        setTickerNews(newsItems);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Please try again later.");
      });
  }, [ticker]);

  // --- Fetch data for ALL ranges on page load ---
  useEffect(() => {
    const fetchAllRanges = async () => {
      // Clear previous data when ticker changes
      setStockPrices({
        "1D": [],
        "1W": [],
        "1M": [],
        "3M": [],
        "1Y": [],
        "5Y": [],
      });

      // Reset technical indicators
      setTechnicalIndicators({
        "1D": { RSI: [], MACD: [], SMA: [], EMA: [] },
        "1W": { RSI: [], MACD: [], SMA: [], EMA: [] },
        "1M": { RSI: [], MACD: [], SMA: [], EMA: [] },
        "3M": { RSI: [], MACD: [], SMA: [], EMA: [] },
        "1Y": { RSI: [], MACD: [], SMA: [], EMA: [] },
        "5Y": { RSI: [], MACD: [], SMA: [], EMA: [] },
      });

      setLoadingRanges(new Set(ranges));
      setError(null);

      // Create an array of promises for each range
      const fetchPromises = ranges.map(async (range) => {
        try {
          let data: any[] = [];

          // Special case for 1D - use the dedicated function to find the most recent trading day
          if (range === "1D") {
            data = await fetchValidPricesForTicker(ticker);
          } else {
            const tq = getTickerQuery(ticker, range);
            console.log({ tq });
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

          if (data.length > 0) {
            // Store the first price as the baseline value for this range
            baselineValuesRef.current[range] = data[0].c;

            // Update stock prices
            setStockPrices((prev) => ({ ...prev, [range]: data }));

            // If this is the selected range, update latest price
            if (range === selectedRange) {
              const latestItem = data[data.length - 1];
              if (latestItem && latestItem.c) {
                setLatestPrice(latestItem.c);
              }
            }

            // Fetch technical indicators for currently active indicators
            activeIndicators.forEach(indicator => {
              fetchIndicatorData(indicator, range);
            });
          }

          // Mark this range as loaded
          setLoadingRanges((prev) => {
            const newSet = new Set(prev);
            newSet.delete(range);
            return newSet;
          });

        } catch (err) {
          console.error(`Error fetching ${range} aggregates:`, err);
          // Mark this range as loaded despite error
          setLoadingRanges((prev) => {
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
  }, [ticker]);

  // --- Subscribe to the WebSocket for real-time updates ---
  useEffect(() => {
    const handleData = (data: any) => {
      if (data.sym === ticker) {
        // Update latest price for the odometer
        if (data.c) {
          // Only update the visible price if not hovering over a specific point
          if (hoveredPrice === null) {
            setLatestPrice(data.c);
          }

          // If we don't have a baseline value for 1D yet, set it
          if (baselineValuesRef.current["1D"] === 0) {
            baselineValuesRef.current["1D"] = data.c;
          }

          // Format the data for real-time update
          const timestamp = data.t || Date.now();

          // Only process if timestamp is within market hours
          if (isWithinMarketHours(timestamp)) {
            
            // Update the chart in real-time if it's showing 1D data
            if (selectedRange === "1D" && mainSeriesRef.current && chartRef.current) {
              try {
                if (chartType === 'baseline') {
                  // For baseline series, we just need the closing price
                  mainSeriesRef.current.update({
                    time: convertToUTCSeconds(timestamp) as Time,
                    value: data.c
                  });
                } else if (chartType === 'candlestick' && data.o && data.h && data.l) {
                  // For candlestick, we need OHLC data
                  mainSeriesRef.current.update({
                    time: convertToUTCSeconds(timestamp) as Time,
                    open: data.o,
                    high: data.h,
                    low: data.l,
                    close: data.c
                  });
                }
              } catch (error) {
                console.error('Error updating chart with websocket data:', error);
              }
            }

            // Also store in our state array
            setStockPrices((prev) => {
              // Only append to 1D data
              const updated1D = [...prev["1D"]];

              // Check if we already have an entry with this timestamp (avoid duplicates)
              const existingIndex = updated1D.findIndex(item => {
                if (!item || !item.t) return false;
                const itemTime = item.t > 1000000000000 ? item.t / 1000 : item.t;
                return Math.abs(itemTime - convertToUTCSeconds(timestamp)) < 1; // Allow 1 second tolerance
              });

              if (existingIndex >= 0) {
                // Update existing entry
                updated1D[existingIndex] = {
                  ...updated1D[existingIndex],
                  c: data.c,
                  o: data.o || updated1D[existingIndex].o,
                  h: data.h || updated1D[existingIndex].h,
                  l: data.l || updated1D[existingIndex].l
                };
              } else {
                // Add new entry
                updated1D.push({
                  t: timestamp,
                  c: data.c,
                  o: data.o || data.c,
                  h: data.h || data.c,
                  l: data.l || data.c
                });
              }

              return {
                ...prev,
                "1D": updated1D
              };
            });
          }
        }
      }
    };

    PolygonWebsocketService.getInstance().subscribe(ticker, handleData);
    return () => {
      PolygonWebsocketService.getInstance().unsubscribe(ticker, handleData);
    };
  }, [ticker, selectedRange, chartType, hoveredPrice]);

  // --- Toggle between line and candlestick chart ---
  const toggleChartType = () => {
    const newChartType = chartType === 'baseline' ? 'candlestick' : 'baseline';
    setChartType(newChartType);

    // If switching to candlestick, pre-load technical indicator data
    if (newChartType === 'candlestick') {
      // Pre-load data for all indicators across all ranges
      Object.keys(TECHNICAL_INDICATORS).forEach(key => {
        const indicator = key as IndicatorKeys;
        ranges.forEach(range => {
          if (technicalIndicators[range][indicator].length === 0) {
            fetchIndicatorData(indicator, range);
          }
        });
      });
    } else {
      // If switching to baseline, remove all active indicators
      setActiveIndicators(new Set());
    }
  };

  // --- Create or update the chart when range or chart type changes ---
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const currentData = stockPrices[selectedRange];
    const isDataLoaded = currentData && currentData.length > 0;
    const isRangeLoading = loadingRanges.has(selectedRange);

    // Clean up any existing chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      mainSeriesRef.current = null;

      // Reset indicator series refs
      Object.keys(indicatorSeriesRefs.current).forEach(key => {
        indicatorSeriesRefs.current[key as IndicatorKeys] = null;
      });
    }

    // Reset hovered price when chart changes
    setHoveredPrice(null);

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
          color: 'rgba(21, 25, 36, 0)', // Make vertical grid lines invisible
        },
        horzLines: {
          color: 'rgba(21, 25, 36, 0)', // Make horizontal grid lines invisible
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
          visible: false, // Hide horizontal crosshair line
        },
      },
      rightPriceScale: {
        borderColor: '#333',
        scaleMargins: {
          top: 0.3, // Add more space at the top for tooltip
          bottom: 0.05,
        },
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

    // Create a new chart
    chartRef.current = createChart(chartContainerRef.current, chartOptions);

    // Add crosshair move handler to update price display when hovering
    chartRef.current.subscribeCrosshairMove(param => {
      if (param.point === undefined || !param.time || param.point.x < 0 || param.point.y < 0) {
        // Reset to latest price when cursor leaves the chart
        setHoveredPrice(null);
        return;
      }

      // Find the price at this time
      if (mainSeriesRef.current) {
        try {
          const point = param.seriesData.get(mainSeriesRef.current);
          if (point) {
            // For candlestick series, we get OHLC data
            if (chartType === 'candlestick' && 'close' in point) {
              setHoveredPrice(point.close);
            }
            // For baseline series, we get a simple value
            else if ('value' in point) {
              setHoveredPrice(point.value);
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

    // Handle resize
    resizeObserverRef.current = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      if (chartRef.current) {
        chartRef.current.applyOptions({ width });
      }
    });

    resizeObserverRef.current.observe(chartContainerRef.current);

    // Add price data if we have it
    if (isDataLoaded) {
      try {
        // Filter data for 1D to only include market hours (4:00 AM to 4:00 PM EST)
        let filteredData = [...currentData];
        if (selectedRange === "1D") {
          filteredData = currentData.filter(d => {
            if (!d || !d.t) return false;
            return isWithinMarketHours(d.t);
          });
        }

        // Ensure we have data after filtering
        if (filteredData.length === 0) {
          console.warn(`No data points after filtering for ${selectedRange}`);

          // If no data after filtering, use the original data
          if (currentData.length > 0) {
            filteredData = currentData;
          }
        }

        // For 1D data with second-level granularity, downsample to prevent chart overcrowding
        if (selectedRange === "1D" && filteredData.length > 1000) {

          if (chartType === 'baseline') {
            // Format and downsample line chart data
            let lineData = filteredData.map((d: any) => {
              if (!d || !d.t || d.c === null || d.c === undefined) return null;

              // Convert timestamp to EST
              const estTimeValue = convertToUTCSeconds(d.t);

              return {
                time: estTimeValue as Time,
                value: d.c
              };
            }).filter(Boolean) as { [key: string]: any; time: Time; }[]; // Remove null entries

            // Sort by time to ensure proper sequence
            lineData.sort((a, b) => (a.time as number) - (b.time as number));

            // Downsample if we have too many points
            const downsampledData = downsampleTimeSeriesData(lineData);

            if (mainSeriesRef.current && downsampledData.length > 0) {
              mainSeriesRef.current.setData(downsampledData);
            }
          } else {
            // Format and downsample candlestick data
            let candleData = filteredData.map((d: any) => {
              if (!d || !d.t || d.c === null || d.c === undefined) return null;

              // Convert timestamp to EST
              const estTimeValue = convertToUTCSeconds(d.t);

              return {
                time: estTimeValue as Time,
                open: d.o || d.c, // Use close as open if open is not available
                high: d.h || d.c, // Use close as high if high is not available
                low: d.l || d.c,  // Use close as low if low is not available
                close: d.c
              };
            }).filter(Boolean) as { [key: string]: any; time: Time; }[]; // Remove null entries

            // Sort by time to ensure proper sequence
            candleData.sort((a, b) => (a.time as number) - (b.time as number));

            // Downsample if we have too many points
            const downsampledData = downsampleTimeSeriesData(candleData);

            if (mainSeriesRef.current && downsampledData.length > 0) {
              mainSeriesRef.current.setData(downsampledData);
            }
          }
        } else {
          // Standard processing for non-1D or data that doesn't need downsampling
          if (chartType === 'baseline') {
            // Format line chart data
            const lineData = filteredData.map((d: any) => {
              if (!d || !d.t || d.c === null || d.c === undefined) return null;

              // Convert timestamp to EST
              const estTimeValue = convertToUTCSeconds(d.t);

              return {
                time: estTimeValue as Time,
                value: d.c
              };
            }).filter(Boolean) as { [key: string]: any; time: Time; }[]; // Remove null entries

            if (mainSeriesRef.current && lineData.length > 0) {
              // Sort by time to ensure proper sequence
              lineData.sort((a, b) => (a?.time as number) - (b?.time as number));
              mainSeriesRef.current.setData(lineData);
            }
          } else {
            // Format candlestick data
            const candleData = filteredData.map((d: any) => {
              if (!d || !d.t || d.c === null || d.c === undefined) return null;

              // Convert timestamp to EST
              const estTimeValue = convertToUTCSeconds(d.t);

              return {
                time: estTimeValue as Time,
                open: d.o || d.c, // Use close as open if open is not available
                high: d.h || d.c, // Use close as high if high is not available
                low: d.l || d.c,  // Use close as low if low is not available
                close: d.c
              };
            }).filter(Boolean) as { [key: string]: any; time: Time; }[]; // Remove null entries

            if (mainSeriesRef.current && candleData.length > 0) {
              // Sort by time to ensure proper sequence
              candleData.sort((a, b) => (a.time as number) - (b.time as number));
              mainSeriesRef.current.setData(candleData);
            }
          }
        }

        // Add active indicator series after main data is loaded
        activeIndicators.forEach(indicator => {
          addIndicatorSeries(indicator);
        });

        // Within your useEffect that updates the chart:
        if (selectedRange === "1D") {
          const { from, to } = getMarketHoursTimestampRange();
          if (filteredData.length > 0) {
            chartRef.current?.timeScale().setVisibleRange({ from, to });
          } else {
            chartRef.current?.timeScale().fitContent();
          }
        } else {
          chartRef.current?.timeScale().fitContent();
        }
      } catch (error) {
        console.error('Error loading chart data:', error);
      }
    }

    return () => {
      if (resizeObserverRef.current && chartContainerRef.current) {
        resizeObserverRef.current.unobserve(chartContainerRef.current);
      }
    };
  }, [selectedRange, chartType, stockPrices, loadingRanges]);

  // --- Add or update indicator series when activeIndicators changes ---
  useEffect(() => {
    if (!chartRef.current || !mainSeriesRef.current) return;

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
        if (indicatorSeriesRefs.current[indicator]) {
          try {
            chartRef.current?.removeSeries(indicatorSeriesRefs.current[indicator]!);
            indicatorSeriesRefs.current[indicator] = null;
          } catch (error) {
            console.error(`Error removing indicator series for ${indicator}:`, error);
          }
        }
      }
    });
  }, [activeIndicators, selectedRange, technicalIndicators]);

  // --- Add indicator series to chart ---
  const addIndicatorSeries = (indicator: IndicatorKeys) => {
    if (!chartRef.current) return;

    const indicatorData = technicalIndicators[selectedRange][indicator];
    if (!indicatorData || !Array.isArray(indicatorData) || indicatorData.length === 0) {
      // If data isn't loaded yet, fetch it
      if (!loadingIndicators.has(indicator)) {
        fetchIndicatorData(indicator, selectedRange);
      }
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

      // Format data for the chart with better error handling
      const priceData = stockPrices[selectedRange] || [];
      const formattedData = formatIndicatorData(indicatorData, indicator, priceData);

      if (formattedData && formattedData.length > 0) {
        // For 1D with many data points, downsample the technical indicators too
        let dataToUse = formattedData;
        if (selectedRange === "1D" && formattedData.length > 500) {
          dataToUse = downsampleTimeSeriesData(formattedData);
        }

        // Double-check formattedData for any null values before adding to the chart
        const safeData = dataToUse.filter(point =>
          point &&
          point.time !== null && point.time !== undefined &&
          point.value !== null && point.value !== undefined &&
          !Number.isNaN(point.value)
        );

        if (safeData.length > 0) {
          series.setData(safeData);
          // Store the series reference
          indicatorSeriesRefs.current[indicator] = series;
        } else {
          // If no valid data points after filtering, remove the series
          chartRef.current.removeSeries(series);
          console.warn(`No valid data points for ${indicator} after filtering`);
        }
      } else {
        // If no formatted data, remove the series
        chartRef.current.removeSeries(series);
        console.warn(`No formatted data for ${indicator}`);
      }
    } catch (error) {
      console.error(`Error adding indicator series for ${indicator}:`, error);
    }
  };

  // Display price is either the hovered price or latest price
  const displayPrice = hoveredPrice !== null ? hoveredPrice : latestPrice;

  const calculateOrderTotal = () => form.shares.length > 0
    ? (parseInt(form.shares) * stockPrices["1D"].slice(-1)[0].price).toFixed(2)
    : 0.00;

  const handleWatchlistAction = (action: any) => (e: any) => {
    e.stopPropagation();
    let watchlistParams: WatchlistParams = { tickerSymbol: ticker };
    if (action === "add") {
      dispatch(addToWatchlist(watchlistParams))
        .then(() => {
          setInWatchlist(!inWatchlist);
          setRemoveWatchlistMesssage(null);
          setRemoveWatchlistClicked(0);
        });
    } else {
      removeFromWatchlist()
    }
  }

  const renderWatchlistButton = () => <input
    type="submit"
    className="watchlist-button"
    onClick={inWatchlist ? handleWatchlistAction("remove") : handleWatchlistAction("add")}
    value={inWatchlist ? "Remove From Watchlist" : "Add to Watchlist"}
  />

  const renderTotalStocks = () => <div className="buying-power">
    {orderType === "SELL"
      ? `You have ${<Odometer price={user.totalStockCount[ticker] || 0} digitInjectedClassName="transaction-number" />} shares to sell`
      : `$ ${<Odometer price={user.funds || 0} digitInjectedClassName="transaction-number" />} Buying Power Available`}
  </div>;

  const handleBuy = () => () => {
    clearErrors();
    clearSuccess();
    setForm({ shares: "" });
    setOrderType("BUY");
    formatOrderType();
  }

  const handleSell = () => () => {
    clearErrors();
    clearSuccess();
    setForm({ shares: "" });
    setOrderType("SELL");
    formatOrderType();
  }

  const handleBuyOrder = () => (e: any) => {
    e.preventDefault();
    clearErrors();
    clearSuccess();
    let transactionParams: TransactionParams = {
      tickerSymbol: ticker,
      transactionAmount: Number(calculateOrderTotal()),
      stockCount: parseInt(form.shares),
      transactionType: orderType,
    }

    const errors = renderErrors();

    if (errors) {
      setErrors(errors);
      return;
    }

    dispatch(createTransaction(transactionParams))
      .then(() => afterBuyAction())
      .then(() => {
        setForm({ shares: "" });
        setSuccess(renderSuccess());
      })
  }

  const afterBuyAction = () => {
    if (inWatchlist === false && orderType === "BUY") {
      let watchlistParams: WatchlistParams = { tickerSymbol: ticker };
      dispatch(addToWatchlist(watchlistParams))
        .then(() => handleFirstBuy());
    }
  };

  const handleFirstBuy = () => {
    setInWatchlist(true);
    setAddedToWatchlist(
      <div className="login-errors">
        This stock has automatically been added to your watchlist so you can easily track changes in price
      </div>
    );
  };

  const removeFromWatchlist = () => {
    const watchlistParams: WatchlistParams = { tickerSymbol: ticker };
    const currentlyInvested = user.totalStockCount;

    if (currentlyInvested[ticker] > 0 && removeWatchlistClicked < 1) {
      setRemoveWatchlistClicked(removeWatchlistClicked + 1);
      setRemoveWatchlistMesssage(
        <div className="login-errors">
          It is not recommended to remove a stock you are currently invested in from your watchlist.
          If you would still like to remove {ticker} from your watchlist please push the button one more time
        </div>
      );
    } else {
      dispatch(deleteFromWatchlist(watchlistParams))
        .then(() => {
          setInWatchlist(false);
          setRemoveWatchlistClicked(0);
          setRemoveWatchlistMesssage(null);
        });
    }
  };

  const formatOrderType = () => `Place ${orderType[0] + orderType.slice(1).toLowerCase()} Order`;

  const renderErrors = () => {
    if (form.shares.length < 1) {
      return <div className="login-errors">
        <img className="error-icon transaction-errors" src={assetService.getImage('whiteWarningIcon')} />
        Please enter a valid number of shares
      </div>
    }
    if (orderType === "BUY") {
      let orderTotal = calculateOrderTotal();
      let orderDifference = (Number(user.funds) || 0) - Number(orderTotal);
      if (orderDifference < 0) {
        return <div className="login-errors transaction-errors">
          <p>
            <img className="error-icon" src={assetService.getImage('whiteWarningIcon')} />
            You don't have enough buying power to buy {parseInt(form.shares)} shares of {ticker}.
          </p> <br />
          <p>
            Please deposit ${Math.abs(orderDifference)} to purchase {parseInt(form.shares)} shares at market price.
          </p>
        </div>
      }
    } else {
      let symbol = ticker;
      let stockCount = user.totalStockCount;
      let stockSymbolCount = stockCount[symbol];
      if (parseInt(form.shares) > stockSymbolCount) {
        return <div className="login-errors transaction-errors">
          <img className="error-icon" src={assetService.getImage('whiteWarningIcon')} />
          You don't have enough enough shares of {ticker} to complete this order. Please buy some more shares.
        </div>
      }
    }
  }

  const clearErrors = () => setErrors(null);

  const clearSuccess = () => {
    setSuccess(null);
    setAddedToWatchlist(null);
  };

  const renderSuccess = () => {
    if (orderType === "BUY") {
      return (
        <>
          <div className="login-errors">
            Congratulations! You just bought {form.shares} shares of {ticker}
          </div>
        </>
      )
    } else {
      return <div className="login-errors">
        Congratulations! You just sold {form.shares} shares of {ticker}
      </div>
    }
  }

  const handleChange = () => (e: any) => {
    let regNum = /^[0-9]*$/
    if (regNum.test(e.target.value)) {
      setForm({ shares: e.target.value });
      calculateOrderTotal();
    }
  }

  return (
    <div className="stock-show-content-container">
      <div className="stock-show-content">
        <div className="main-content-container">
          <div className="stock-show-header">
            <span>{ticker}</span>
            <PriceOdometer price={displayPrice} formatPrice={formatPrice} injectedClassName="price-header" />
          </div>

          {/* Chart controls */}
          <div className="controls-container">
            {/* Range selection buttons */}
            <div className="range-buttons">
              {ranges.map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  disabled={loadingRanges.has(range)}
                  className={`range-button ${selectedRange === range ? 'active' : ''} ${loadingRanges.has(range) ? 'loading' : ''}`}
                >
                  {range}
                  {loadingRanges.has(range) && " ..."}
                </button>
              ))}
            </div>

            <div className="controls-right">
              {/* Technical Indicators Dropdown - only enabled for candlestick charts */}
              {chartType === 'candlestick' && <div className="indicator-dropdown">
                <button
                  onClick={() => chartType === 'candlestick' && setDropdownOpen(!dropdownOpen)}
                  className={`chart-button ${chartType !== 'candlestick' ? 'disabled' : ''}`}
                >
                  Add Indicator {dropdownOpen ? '▲' : '▼'}
                </button>

                {dropdownOpen && chartType === 'candlestick' && (
                  <div className="dropdown-menu">
                    {Object.keys(TECHNICAL_INDICATORS).map((key) => {
                      const indicator = key as IndicatorKeys;
                      const config = TECHNICAL_INDICATORS[indicator];
                      const isActive = activeIndicators.has(indicator);
                      const isLoading = loadingIndicators.has(indicator);

                      return (
                        <div
                          key={indicator}
                          onClick={() => {
                            if (!isLoading) toggleIndicator(indicator);
                            setDropdownOpen(false);
                          }}
                          className={`dropdown-item ${isLoading ? 'loading' : ''}`}
                          style={{ color: config.color }}
                        >
                          <span>{config.name}</span>
                          {isActive ? (
                            <span>✓</span>
                          ) : isLoading ? (
                            <span>...</span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>}

              {/* Chart type toggle button */}
              <button
                onClick={toggleChartType}
                className="chart-button"
              >
                {chartType === 'baseline' ? 'Switch to Candlestick' : 'Switch to Line'}
              </button>
            </div>
          </div>

          {/* Active indicators list with remove buttons - only visible in candlestick mode */}
          {activeIndicators.size > 0 && chartType === 'candlestick' && (
            <div className="active-indicators">
              {Array.from(activeIndicators).map(indicator => (
                <div
                  key={indicator}
                  className="indicator-tag"
                  style={{ borderColor: TECHNICAL_INDICATORS[indicator].color }}
                >
                  <span style={{ color: TECHNICAL_INDICATORS[indicator].color }}>
                    {TECHNICAL_INDICATORS[indicator].name}
                  </span>
                  <button
                    onClick={() => toggleIndicator(indicator)}
                    className="remove-indicator"
                  >
                    ✕
                  </button>
                  {loadingIndicators.has(indicator) && (
                    <span className="loading-indicator">loading...</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Chart container */}
          <div
            ref={chartContainerRef}
            className="chart-container"
          >
            {(loadingRanges.has(selectedRange) || (activeIndicators.size > 0 && Array.from(activeIndicators).some(indicator => loadingIndicators.has(indicator)))) && (
              <div className="loading-overlay">
                Loading data...
              </div>
            )}

            {error && !loadingRanges.has(selectedRange) && stockPrices[selectedRange].length === 0 && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>


          <div className="stock-info">
            <hr />
            <h2>About</h2>
            <hr />
            <div className="stock-description">
              {companyProfile.description}
            </div>
            <div className="info-subsets">
              <div className="info-row">
                <div>
                  <div className="info-subheader">CEO</div> <br />
                  {companyProfile.ceo}
                </div>
                <div>
                  <div className="info-subheader">Employees</div> <br />
                  {companyProfile.fullTimeEmployees}
                </div>
                <div>
                  <div className="info-subheader">Headquarters</div> <br />
                  {companyProfile.city}, {companyProfile.country}
                </div>
                <div>
                  <div className="info-subheader">Market Cap</div> <br />
                  {formatNumber(companyProfile.mktCap)}
                </div>
              </div>
              <div className="info-row">
                <div>
                  <div className="info-subheader">Price-Earnings Ratio</div> <br />
                  {info.PERatio}
                </div>
                <div>
                  <div className="info-subheader">Average Volume</div> <br />
                  {formatNumber(companyProfile.volAvg)}
                </div>
                <div>
                  <div className="info-subheader">High Today</div> <br />
                  {keyStats?.["03. high"] || ''}
                </div>
                <div>
                  <div className="info-subheader">Low Today</div> <br />
                  {keyStats?.["04. low"]}
                </div>
              </div>
              <div className="info-row">
                <div>
                  <div className="info-subheader">Open Price</div> <br />
                  {keyStats?.["02. open"]}
                </div>
                <div>
                  <div className="info-subheader">Volume</div> <br />
                  {formatNumber(keyStats?.["06. volume"])}
                </div>
                <div>
                  <div className="info-subheader">52 Week High</div> <br />
                  ${info["52WeekHigh"]}
                </div>
                <div>
                  <div className="info-subheader">52 Week Low</div> <br />
                  ${info["52WeekLow"]}
                </div>
              </div>
            </div>
            <div>
              <h2>News</h2>
              <hr />
            </div>
          </div>

          {/* News Section */}
          <div className="news-container">
            <h3 className="news-header">Latest News</h3>
            {tickerNews.length > 0 ? tickerNews : <p>No recent news available for {ticker}</p>}
          </div>
        </div>


        <div className="transaction-container">
          <div className="transaction-form">
            <div className="transaction-type-header">
              <button className={`transaction-header-${orderType === "BUY"} stockflow-button`} onClick={handleBuy()}>Buy <span>{ticker}</span></button>
              <button className={`transaction-header-${orderType === "SELL"} stockflow-button`} onClick={handleSell()}>Sell <span>{ticker}</span></button>
            </div>
            <hr className="transaction-break" />
            <div>
              <form className="transaction-form-item">
                <div className="transaction-form-row">
                  <span>Shares</span>
                  <input className="transaction-input" type="text" value={form.shares} onChange={handleChange()} placeholder="0" />
                </div>
                <div className="transaction-form-row">
                  <p>Market Price</p> <span>${stockPrices["1D"][stockPrices["1D"].length - 1]?.c?.toFixed(2) || 0}</span>
                </div>
                <hr className="transaction-break" />
                <div className="transaction-form-row">
                  <p>Estimated Cost</p> <span>${calculateOrderTotal()}</span>
                </div>
                <div>
                  {errors} {success} {addedToWatchlist}
                </div>
                <div>
                  <button className="transaction-submit" type="submit" onClick={handleBuyOrder()}>{formatOrderType()}</button>
                </div>
                <hr className="transaction-break" />
                <div>
                  {renderTotalStocks()}
                </div>
              </form>
            </div>
            <div className="watchlist-button-container">
              {renderWatchlistButton()}
            </div>
            <div>
              {removeWatchlistMessage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockShow;
