import React, { useEffect, useState, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, Time, LineSeries, ColorType } from 'lightweight-charts';
import { PolygonWebsocketService } from '../../websocket/polygonWebsocketService';
import { fetchValidPricesForTicker } from '../../util/polygon_api_util';
import { convertToUTCSeconds } from '../../util/chart_util';

interface WatchlistItemProps {
  symbol: string;
}

const WatchlistItem: React.FC<WatchlistItemProps> = ({ symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

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
        width: 100,
        height: 100,
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
      });

      // Create line series
      seriesRef.current = chartRef.current.addSeries(LineSeries, {
        color: '#2962FF',
        lineWidth: 2,
      });

      // Set initial data
      seriesRef.current.setData(chartData);

      // Set current price if data exists
      if (chartData.length > 0) {
        setCurrentPrice(chartData[chartData.length - 1].value);
      }
    };

    initializeChart();

    // WebSocket subscription for real-time updates
    const handleData = (data: any) => {
      if (data.sym === symbol && data.c) {
        const time = convertToUTCSeconds(data.t) as Time;
        const value = data.c;
        seriesRef.current?.update({ time, value });
        setCurrentPrice(value);
      }
    };

    PolygonWebsocketService.getInstance().subscribe(symbol, handleData);

    // Cleanup on unmount
    return () => {
      chartRef.current?.remove();
      PolygonWebsocketService.getInstance().unsubscribe(symbol, handleData);
    };
  }, [symbol]);

  return (
    <div className="watchlist-item">
      <span className="symbol">{symbol}</span>
      <div className="watchlist-chart-container" ref={chartContainerRef} />
      <span className="price">${currentPrice.toFixed(2)}</span>
    </div>
  );
};

export default WatchlistItem;