import React, { useEffect, useState } from "react";
import { ISnapshotTickers, restClient, UniversalSnapshotInfo } from "@polygon.io/client-js";
import { PriorityQueue } from "js-sdsl";
import { findTopStocks } from "../../util/util";
import { getApiKeys } from "../../services/apiKeyService";

const TopMovers = (): React.JSX.Element => {
  const [polygonRestClient, setPolygonRestClient] = useState<any>(null);
  const [topDailyMovers, setTopDailyMovers] = useState<UniversalSnapshotInfo[]>([]);

  useEffect(() => {
    const initializePolygonClient = async () => {
      try {
        // Get API keys securely
        const apiKeys = await getApiKeys();
        
        // Initialize the Polygon client with the securely fetched API key
        const client = restClient(apiKeys.polygon_api_key);
        setPolygonRestClient(client);
      } catch (error) {
        console.error("Failed to initialize Polygon client:", error);
      }
    };
    
    initializePolygonClient();
  }, []);

  useEffect(() => {
    if (!polygonRestClient) { return; }
    polygonRestClient.stocks.snapshotAllTickers({}).then((res: ISnapshotTickers) => {
      const tickers: UniversalSnapshotInfo[] | undefined = res.tickers;
  
      if (!tickers) { return; }
  
      const comparator = (a: UniversalSnapshotInfo, b: UniversalSnapshotInfo) => 
        Math.abs(a.session?.change_percent || 0) - Math.abs(b.session?.change_percent || 0);
      const minHeapRemoval = (minHeap: PriorityQueue<UniversalSnapshotInfo>, stock: UniversalSnapshotInfo) =>
        Math.abs(stock.session?.change_percent || 0) > Math.abs(minHeap.top()?.session?.change_percent || 0);
      const topSixMovers: UniversalSnapshotInfo[] = findTopStocks(tickers, 6, comparator, minHeapRemoval);
      
      setTopDailyMovers(topSixMovers);
    })
  }, [polygonRestClient])
  
  return (
    <>
    </>
  )
}

export default TopMovers;
