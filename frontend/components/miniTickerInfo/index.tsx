import React, { useEffect, useState } from "react"
import { ISnapshot, restClient } from "@polygon.io/client-js";
import { Link } from "react-router-dom";
import { MiniTickerInfoProps, PriceDirection } from "./miniTickerInfo.interfaces";
import { getApiKeys } from "../../services/apiKeyService";

const MiniTickerInfo = ({ ticker }: MiniTickerInfoProps): React.JSX.Element => {
  const [polygonRestClient, setPolygonRestClient] = useState<any>(null);
  const [priceDirection, setPriceDirection] = useState<PriceDirection>(PriceDirection.UP);
  const [tickerPercentage, setTickerPercentage] = useState<number>(0.00);

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

    polygonRestClient.stocks.snapshotTicker(ticker).then((res: ISnapshot) => {
      const tickerInfo = res.ticker?.todaysChangePerc;
      if (tickerInfo === null || tickerInfo === undefined) { return; }

      setTickerPercentage(tickerInfo);
      setPriceDirection(tickerInfo < 0 ? PriceDirection.DOWN : PriceDirection.UP);
    })
  }, []);

  return (
    <Link className="mini-ticker-link" to={`/stock/${ticker}`}>
      <div className={`mini-ticker-container ${priceDirection === PriceDirection.UP ? "hover-green" : "hover-red"}`}>
        <div className="ticker-name">{ticker}</div>
        <div className={priceDirection === PriceDirection.UP
          ? "green-up-triangle"
          : "red-down-triangle"
        }></div>
        <div className="percentage">{tickerPercentage.toFixed(2)}%</div>
      </div>
    </Link>
  )
}

export default MiniTickerInfo;
