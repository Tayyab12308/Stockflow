import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { createChart, IChartApi, ISeriesApi, Time, BaselineSeries, ColorType } from 'lightweight-charts';
import { PolygonWebsocketService } from '../../websocket/polygonWebsocketService';
import { fetchValidPricesForTicker } from '../../util/polygon_api_util';
import { convertToUTCSeconds } from '../../util/chart_util';
import { Link } from 'react-router-dom';

interface WatchlistItemProps {
  symbol: string;
}

const WatchlistItem: React.FC<WatchlistItemProps> = ({ symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [isPositive, setIsPositive] = useState<boolean>(true);
  const [openPrice, setOpenPrice] = useState<number | null>(null);

  // Create and setup the chart
  useEffect(() => {
    const initializeChart = async () => {
      if (!chartContainerRef.current) return;

      // Fetch historical data for today
      const data = await fetchValidPricesForTicker(symbol);
      const chartData = data
        .map(d => ({
          time: convertToUTCSeconds(d.t) as Time,
          value: d.c,
        }));

      // Create chart with minimal configuration
      chartRef.current = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: 'transparent',
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { visible: false },
        },
        crosshair: {
          mode: 0, // No crosshair
        },
        rightPriceScale: {
          visible: false,
        },
        timeScale: {
          visible: false,
        },
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight || 50, // Provide a default height
      });

      // Determine if the stock is up or down based on the first data point vs. the last
      if (chartData.length > 0) {
        const firstPoint = chartData[0].value;
        const lastPoint = chartData[chartData.length - 1].value;
        const positive = lastPoint >= firstPoint;
        setIsPositive(positive);
        setOpenPrice(firstPoint);
        setCurrentPrice(lastPoint);

        // Create baseline series with color based on performance
        seriesRef.current = chartRef.current.addSeries(BaselineSeries, {
          baseValue: { type: 'price', price: firstPoint },
          topLineColor: 'rgba(38, 166, 154, 1)',
          topFillColor1: 'rgba(38, 166, 154, 0.28)',
          topFillColor2: 'rgba(38, 166, 154, 0.05)',
          bottomLineColor: 'rgba(239, 83, 80, 1)',
          bottomFillColor1: 'rgba(239, 83, 80, 0.05)',
          bottomFillColor2: 'rgba(239, 83, 80, 0.28)',
          lineWidth: 2,
        });

        // Set initial data
        seriesRef.current.setData(chartData);
      } else {
        // If no data, default to a positive, empty baseline series
        seriesRef.current = chartRef.current.addSeries(BaselineSeries, {
          baseValue: { type: 'price', price: 0 },
          topLineColor: 'rgba(76, 175, 80, 1)',
          topFillColor1: 'rgba(76, 175, 80, 0.28)',
          topFillColor2: 'rgba(76, 175, 80, 0.05)',
          bottomLineColor: 'rgba(76, 175, 80, 1)',
          bottomFillColor1: 'rgba(76, 175, 80, 0.05)',
          bottomFillColor2: 'rgba(76, 175, 80, 0.28)',
          lineWidth: 2,
        });
      }
    };

    initializeChart();

    // WebSocket subscription for real-time updates
    const handleData = (data: any) => {
      if (data.sym === symbol && data.c) {
        const time = convertToUTCSeconds(data.t) as Time;
        const value = data.c;

        // Update the chart with new data
        seriesRef.current?.update({ time, value });
        setCurrentPrice(value);

        // Update the direction if we have an open price
        if (openPrice !== null) {
          const newIsPositive = value >= openPrice;

          // If direction changed, recreate the series with new colors
          if (newIsPositive !== isPositive && chartRef.current) {
            setIsPositive(newIsPositive);

            // Remove old series
            if (seriesRef.current) {
              chartRef.current.removeSeries(seriesRef.current);
            }

            // Create new series with updated colors
            seriesRef.current = chartRef.current.addSeries(BaselineSeries, {
              baseValue: { type: 'price', price: openPrice },
              topLineColor: newIsPositive ? 'rgba(76, 175, 80, 1)' : 'rgba(255, 82, 82, 0.8)',
              topFillColor1: newIsPositive ? 'rgba(76, 175, 80, 0.28)' : 'rgba(255, 82, 82, 0.28)',
              topFillColor2: newIsPositive ? 'rgba(76, 175, 80, 0.05)' : 'rgba(255, 82, 82, 0.05)',
              bottomLineColor: newIsPositive ? 'rgba(76, 175, 80, 1)' : 'rgba(255, 82, 82, 0.8)',
              bottomFillColor1: newIsPositive ? 'rgba(76, 175, 80, 0.05)' : 'rgba(255, 82, 82, 0.05)',
              bottomFillColor2: newIsPositive ? 'rgba(76, 175, 80, 0.28)' : 'rgba(255, 82, 82, 0.28)',
              lineWidth: 2,
            });

            // Fetch data again to populate the new series
            fetchValidPricesForTicker(symbol).then(data => {
              const chartData = data.map(d => ({
                time: convertToUTCSeconds(d.t) as Time,
                value: d.c,
              }));
              seriesRef.current?.setData(chartData);
            });
          }
        }
      }
    };

    PolygonWebsocketService.getInstance().subscribe(symbol, handleData);

    // Cleanup on unmount
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      chartRef.current?.remove();
      PolygonWebsocketService.getInstance().unsubscribe(symbol, handleData);
    };
  }, [symbol]);

  // Handle resize events using ResizeObserver
  useLayoutEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        const { clientWidth, clientHeight } = chartContainerRef.current;
        chartRef.current.applyOptions({
          width: clientWidth,
          height: clientHeight || 50, // Ensure a minimum height
        });
        chartRef.current.timeScale().fitContent(); // Optional: fit content after resize
      }
    };

    // Initial size
    handleResize();

    // Setup ResizeObserver for the chart container
    if (chartContainerRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        window.requestAnimationFrame(handleResize);
      });

      resizeObserverRef.current.observe(chartContainerRef.current);
    }

    // Also handle window resize events as a fallback
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // Calculate price change and percentage
  const priceChange = openPrice !== null ? currentPrice - openPrice : 0;
  const priceChangePercent = openPrice !== null && openPrice !== 0
    ? (priceChange / openPrice) * 100
    : 0;

  return (
    <Link className='watchlist-link' to={`/stock/${symbol}`}>
      <div className="watchlist-item">
        <span className="symbol">{symbol}</span>
        <div className="watchlist-chart-container" ref={chartContainerRef} />
        <div className="price-container">
          <span className="price">${currentPrice.toFixed(2)}</span>
          <span className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%
          </span>
        </div>
      </div>
    </Link>
  );
};

export default WatchlistItem;
