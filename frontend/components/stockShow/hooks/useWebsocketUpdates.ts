import React, { useEffect, useRef } from 'react';
import { PolygonWebsocketService } from '../../../websocket/polygonWebsocketService';

interface WebSocketUpdatesProps {
  ticker: string;
  selectedRange: string;
  chartType: string;
  hoveredPrice: number | null;
  setHoveredPrice: (price: number | null) => void;
  setLatestPrice: (price: number) => void;
  baselineValuesRef: React.MutableRefObject<Record<string, number>>;
}

export const useWebSocketUpdates = ({
  ticker,
  selectedRange,
  chartType,
  hoveredPrice,
  setHoveredPrice,
  setLatestPrice,
  baselineValuesRef
}: WebSocketUpdatesProps) => {
  // Use refs to track last update time to prevent excessive re-renders
  const lastUpdateTimeRef = useRef<number>(0);
  const THROTTLE_MS = 500; // Only update every 500ms

  // Subscribe to WebSocket for real-time updates
  useEffect(() => {
    // Handle data coming from websocket
    const handleData = (data: any) => {
      if (data.sym !== ticker || !data.c) return;
      
      const now = Date.now();
      
      // Only update the visible price if not hovering and not throttled
      if (hoveredPrice === null && now - lastUpdateTimeRef.current > THROTTLE_MS) {
        setLatestPrice(data.c);
        lastUpdateTimeRef.current = now;
      }

      // If we don't have a baseline value for 1D yet, set it
      if (baselineValuesRef.current["1D"] === 0) {
        baselineValuesRef.current["1D"] = data.c;
      }
    };

    // Subscribe to WebSocket updates
    PolygonWebsocketService.getInstance().subscribe(ticker, handleData);
    
    // Clean up subscription on unmount
    return () => {
      PolygonWebsocketService.getInstance().unsubscribe(ticker, handleData);
    };
  }, [ticker, hoveredPrice]); // Only depend on ticker and hoveredPrice
};