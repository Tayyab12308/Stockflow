import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers/root_reducer";
import { convertKeysToCamelCase, timeSince } from "../../util/util";
import { User } from "../../interfaces/user.interface";
import { AppDispatch } from "../../store";
import { fetchCompany, fetchCompanyProfile, fetchKeyStats } from "../../util/stock_api_util";
import { fetchTickerNews } from "../../util/polygon_api_util";

// Custom hooks
import { useStockData } from './hooks/useStockData';
import { useTechnicalIndicators } from './hooks/useTechnicalIndicators';
import { useWebSocketUpdates } from './hooks/useWebsocketUpdates';
import { useTransactionHandling } from './hooks/useTransactionHandling';
import { useWatchlistHandling } from './hooks/useWatchlistHandling';

// Components
import PriceHeader from './components/PriceHeader';
import ChartControls from './components/ChartControls';
import StockChart from './components/StockChart';
import CompanyInfo from './components/CompanyInfo';
import NewsSection from './components/NewsSection';
import TransactionPanel from './components/TransactionPanel';

// Types
import { Period, IndicatorKeys } from './types';
import News from "../news";

const StockShow: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  if (!ticker) return <>No Ticker Found</>;

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => convertKeysToCamelCase(Object.values(state.entities.users)[0]) as User);

  // Initialize custom hooks
  const {
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
    error
  } = useStockData(ticker);

  const {
    technicalIndicators,
    activeIndicators,
    setActiveIndicators,
    loadingIndicators,
    toggleIndicator,
    fetchIndicatorData
  } = useTechnicalIndicators(ticker, stockPrices, selectedRange);

  // Subscribe to WebSocket updates
  useWebSocketUpdates({
    ticker,
    selectedRange,
    chartType,
    hoveredPrice,
    setHoveredPrice,
    setLatestPrice: (price) => latestPrice.current = price,
    baselineValuesRef
  });

  // Company data state
  const [companyData, setCompanyData] = useState({
    profile: {},
    info: {},
    keyStats: {}
  });

  // News state
  const [tickerNews, setTickerNews] = useState<React.JSX.Element[]>([]);

  // Transaction handling
  const transactionHandling = useTransactionHandling(user, ticker, stockPrices["1D"]);

  // Watchlist handling
  const watchlistHandling = useWatchlistHandling(user, ticker, dispatch);

  // Fetch company info and news
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const [companyInfo, stats, profileResponse, newsData] = await Promise.all([
          fetchCompany(ticker).catch(err => console.log('Failed to fetch Company Data. Error:', err)),
          fetchKeyStats(ticker).catch(err => console.log('Failed to fetch Key Stats. Error:', err)),
          fetchCompanyProfile(ticker).catch(err => console.log('Failed to fetch Company Profile. Error:', err)),
          fetchTickerNews(ticker).catch(err => console.log('Failed to fetch Company News. Error:', err))
        ]);

        setCompanyData({
          info: companyInfo,
          keyStats: stats?.["Global Quote"] || {},
          profile: profileResponse?.[0] || {}
        });

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
              injectedClassName="ticker-news"
            />
          );
        });
        setTickerNews(newsItems);
      } catch (err) {
        console.error("Error fetching company data:", err);
      }
    };

    fetchCompanyData();
    watchlistHandling.checkInWatchlist();
  }, [ticker, dispatch]);

  // Compute display price
  const displayPrice = hoveredPrice !== null ? hoveredPrice : latestPrice.current;

  return (
    <div className="stock-show-content-container">
      <div className="stock-show-content">
        <div className="main-content-container stock-show">
          {/* Header with ticker and price */}
          <PriceHeader
            ticker={ticker}
            price={displayPrice}
          />

          {/* Chart controls (range buttons, indicators, chart type) */}
          <ChartControls
            ranges={["1D", "1W", "1M", "3M", "1Y", "5Y"]}
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
            chartType={chartType}
            onChartTypeChange={setChartType}
            loadingRanges={loadingRanges}
            activeIndicators={activeIndicators}
            onToggleIndicator={toggleIndicator}
            loadingIndicators={loadingIndicators}
          />

          {/* Main stock chart */}
          <StockChart
            ticker={ticker}
            selectedRange={selectedRange}
            chartType={chartType}
            stockPrices={stockPrices}
            loadingRanges={loadingRanges}
            activeIndicators={activeIndicators}
            technicalIndicators={technicalIndicators}
            baselineValuesRef={baselineValuesRef}
            onHoverPriceChange={setHoveredPrice}
            error={error}
            fetchIndicatorData={fetchIndicatorData}
          />

          <TransactionPanel
            injectedClassName={'mobile'}
            ticker={ticker}
            latestPrice={latestPrice.current}
            user={user}
            {...transactionHandling}
            {...watchlistHandling}
          />

          {/* Company information section */}
          <CompanyInfo
            companyProfile={companyData.profile}
            info={companyData.info}
            keyStats={companyData.keyStats}
          />

          {/* News section */}
          <NewsSection news={tickerNews} ticker={ticker} />
        </div>

        {/* Transaction panel (Buy/Sell) */}
        <TransactionPanel
          injectedClassName={'wide'}
          ticker={ticker}
          latestPrice={latestPrice.current}
          user={user}
          {...transactionHandling}
          {...watchlistHandling}
        />
      </div>
    </div>
  );
};

export default StockShow;
