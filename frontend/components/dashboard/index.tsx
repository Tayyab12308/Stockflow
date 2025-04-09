import React, { useEffect, useState } from "react";
import Watchlist from "../watchlist";
import { useNavigate } from "react-router-dom";
import HorizontalTileCarousel, { TileItem } from "../tileCarousel";
import WhyInvest from "../learn/whyInvest";
import StockMarketInfo from "../learn/stockMarketInfo";
import InvestingMythbusters from "../learn/investingMythbusters";
import Goals from "../learn/goals";
import UnderstandingRisk from "../learn/understandingRisk";
import DifferentInvestments from "../learn/differentInvestments";
import StockBasics from "../learn/stockBasics";
import CryptoBasics from "../learn/cryptoBasics";
import IpoBasics from "../learn/ipoBasics";
import CryptoTaxLossHarvesting from "../learn/cryptoTaxLossHarvesting";
import EtfBasics from "../learn/etfBasics";
import News from "../news";
import { ITickerNews, restClient } from "@polygon.io/client-js";
import { convertKeysToCamelCase, timeSince } from "../../util/util";
import TopMovers from "../topMovers";
import WatchlistItem from "../watchlist";
import { RootState } from "../../reducers/root_reducer";
import { useSelector } from "react-redux";
import { getApiKeys } from "../../services/apiKeyService";
import assetService from "../../services/assetService";


interface TrendingListItem {
  icon: string;
  title: string;
  path: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [polygonRestClient, setPolygonRestClient] = useState<any>(null);
  const [collapsedDiscover, setCollapsedDiscover] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [news, setNews] = useState<React.JSX.Element[]>([]);
  const watchlist = useSelector((state: RootState) => convertKeysToCamelCase(Object.values(state.entities.users)[0].watchlist));

  const trendingListData: TrendingListItem[] = [
    { icon: assetService.getImage('newlyListedCryptoIcon'), title: 'Newly Listed Crypto', path: "/list/newly-listed-crypto" },
    { icon: assetService.getImage('tradableCryptoIcon'), title: 'Tradable Crypto', path: "/list/tradable-crypto" },
    { icon: assetService.getImage('ipoAccessIcon'), title: 'IPO Access', path: "/list/ipo-access" },
    { icon: assetService.getImage('altcoinsIcon'), title: 'Altcoins', path: "/list/altcoin" },
    { icon: assetService.getImage('hundredMostPopularIcon'), title: '100 Most Popular', path: "/list/hundred-most-popular" },
    { icon: assetService.getImage('dailyMoversIcon'), title: 'Daily Movers', path: "/list/daily-movers" },
    { icon: assetService.getImage('cannabisIcon'), title: 'Cannabis', path: "/list/cannabis" },
    { icon: assetService.getImage('upcomingEarningsIcon'), title: 'Upcoming Earnings', path: "/list/upcoming-earnings" },
    { icon: assetService.getImage('twentyFourHourMarketIcon'), title: '24 Hour Market', path: "/list/twenty-four-hour-market" },
    { icon: assetService.getImage('techMediaTelecomIcon'), title: 'Tech, Media, & Telecom', path: "/list/tech-media-telecom" },
    { icon: assetService.getImage('etfIcon'), title: 'ETFs', path: "/list/etfs" },
    { icon: assetService.getImage('energyIcon'), title: 'Energy', path: "/list/energy" },
    { icon: assetService.getImage('pharmaIcon'), title: 'Pharma', path: "/list/pharma" },
    { icon: assetService.getImage('growthValueEtfIcon'), title: 'Growth & Value ETFs', path: "/list/growth-and-value-etf" },
    { icon: assetService.getImage('energyWaterIcon'), title: 'Energy & Water', path: "/list/energy-and-water" },
    { icon: assetService.getImage('healthcareIcon'), title: 'Healthcare', path: "/list/healthcare" },
    { icon: assetService.getImage('consumerGoodsIcon'), title: 'Consumer Goods', path: "/list/consumer-goods" },
    { icon: assetService.getImage('realEstateIcon'), title: 'Real Estate', path: "/list/real-estate" },
    { icon: assetService.getImage('businessIcon'), title: 'Business', path: "/list/business" },
    { icon: assetService.getImage('softwareIcon'), title: 'Software', path: "/list/software" },
    { icon: assetService.getImage('sectorETFsIcon'), title: 'Sector ETFs', path: "/list/sector-etfs" },
    { icon: assetService.getImage('automotiveIcon'), title: 'Automotive', path: "/list/automotive" },
    { icon: assetService.getImage('realEstateETFsIcon'), title: 'Real Estate ETFs', path: "/list/real-estate-etfs" },
    { icon: assetService.getImage('bankingIcon'), title: 'Banking', path: "/list/banking" },
    { icon: assetService.getImage('bondETFsIcon'), title: 'Bond ETFs', path: "/list/bond-etfs" },
    { icon: assetService.getImage('financeIcon'), title: 'Finance', path: "/list/finance" },
    { icon: assetService.getImage('healthcareSuppliesIcon'), title: 'Healthcare Supplies', path: "/list/healthcare-supplies" },
    { icon: assetService.getImage('commoditiesETFsIcon'), title: 'Commodities ETFs', path: "/list/commodities-etfs" },
  ];

  const tileItems: TileItem[] = [
    {
      id: 1,
      title: 'Why invest?',
      imageUrl: assetService.getImage('whyInvestTileIcon'),
      flyoutContent: <WhyInvest />,
      color: "rgb(0, 38, 21)",
    },
    {
      id: 2,
      title: 'What\'s the stock market?',
      imageUrl: assetService.getImage('stockMarketInfoTileIcon'),
      flyoutContent: <StockMarketInfo />,
      color: "rgb(0, 42, 81)",
    },
    {
      id: 3,
      title: 'Investing mythbusters',
      imageUrl: assetService.getImage('investingMythbustersTileIcon'),
      flyoutContent: <InvestingMythbusters />,
      color: "rgb(35, 135, 88)",
    },
    {
      id: 4,
      title: 'What are your goals?',
      imageUrl: assetService.getImage('goalsTileIcon'),
      flyoutContent: <Goals />,
      color: "rgb(82, 20, 43)",
    },
    {
      id: 5,
      title: 'What is risk?',
      imageUrl: assetService.getImage('understandingRiskTileIcon'),
      flyoutContent: <UnderstandingRisk />,
      color: "rgb(105, 77, 0)",
    },
    {
      id: 6,
      title: 'What can you invest in?',
      imageUrl: assetService.getImage('differentInvestmentsTileIcon'),
      flyoutContent: <DifferentInvestments />,
      color: "rgb(0, 42, 81)",
    },
    {
      id: 7,
      title: 'What\'s a stock?',
      imageUrl: assetService.getImage('stockBasicsTileIcon'),
      flyoutContent: <StockBasics />,
      color: "rgb(0, 64, 34)",
    },
    {
      id: 8,
      title: 'What\'s an ETF?',
      imageUrl: assetService.getImage('etfBasicsTileIcon'),
      flyoutContent: <EtfBasics />,
      color: "rgb(0, 127, 245)",
    },
    {
      id: 9,
      title: 'What to know about crypto?',
      imageUrl: assetService.getImage('cryptoBasicsTileIcon'),
      flyoutContent: <CryptoBasics />,
      color: "rgb(36, 30, 51)",
    },
    {
      id: 10,
      title: 'What\'s an IPO?',
      imageUrl: assetService.getImage('ipoBasicsTileIcon'),
      flyoutContent: <IpoBasics />,
      color: "rgb(1, 82, 44)",
    },
    {
      id: 11,
      title: 'Crypto Tax-Loss Harvesting',
      imageUrl: assetService.getImage('cryptoTaxLossHarvestingTileIcon'),
      flyoutContent: <CryptoTaxLossHarvesting />,
      color: "rgb(36, 30, 51)",
    },
  ];
  
  useEffect(() => {
    const initializePolygonClient = async () => {
      try {
        const apiKeys = await getApiKeys();
        const client = restClient(apiKeys.polygon_api_key);
        setPolygonRestClient(client);
      } catch (error) {
        console.error("Failed to initialize Polygon client:", error);
        setLoading(false);
      }
    };
    
    initializePolygonClient();
  }, []);

  useEffect(() => {
    if (!polygonRestClient) { return; }

    polygonRestClient.reference.tickerNews({
      order: "desc",
      limit: 10,
      sort: "published_utc"
    }).then((res: ITickerNews) => {
      const newsItems = res.results.map((news, idx: number) => {
        const { publisher, image_url, title, tickers, published_utc, article_url } = news;
        return <News
          key={idx}
          publisher={publisher.name || ""}
          title={title}
          imageUrl={image_url || ""}
          tickers={tickers}
          url={article_url || ""}
          time={timeSince(published_utc)}
          shouldDisplayTicker={true}
        />
      })
      setLoading(false);
      setNews(newsItems);
    })
  }, [polygonRestClient])

  return (
    <div className="dashboard-content-container">
      <div className="dashboard-content">
        <div className="main-content-container">
          <section className="intro-section">
            <div className="dashboard-header">
              Investing
            </div>
            <img className="dashboard-image" src={assetService.getImage('dashboardGraphReplacementBackground')} />
            <div className="welcome-text">
              Welcome to Stockflow
            </div>
          </section>
          <section className="discovery-learning-section-container">
            <section className="discover-investments-section">
              <div className="discover-header-section">
                <div className="left-header-container">
                  <div className="discover-headline">
                    Discover Investments
                  </div>
                  <img src={assetService.getImage('grayWarningIcon')} />
                </div>
                <div className="right-header-container">
                  <button
                    className="discover-section-adjuster"
                    onClick={() => setCollapsedDiscover(!collapsedDiscover)}>{collapsedDiscover ? 'Show More' : 'Show Less'}
                  </button>
                </div>
              </div>
              <div className={`trending-list-container ${collapsedDiscover ? 'collapsed' : ''}`}>
                {trendingListData.map(({ icon, title, path }: TrendingListItem, idx: number) => (
                  <div key={idx} className="trending-list-item" onClick={() => navigate(path)}>
                    <img className="trending-list-icon" src={icon} />
                    <div className="trending-list-title">
                      {title}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="learn-investing-section">
              <div className="learn-header-section">
                <div className="left-header-container">
                  <div className="learn-headline">
                    Learn About Investing
                  </div>
                  <div className="new-lessons-mini-banner">
                    <img className="new-lessons-star-image" src={assetService.getImage('whiteStar')} />
                    <div className="new-lessons-title">New lessons</div>
                  </div>
                </div>
                <div className="right-header-container">
                  <button className="learn-section-link" onClick={() => navigate("/education")}>Show More</button>
                </div>
              </div>
              <div className="learn-tile-container">
                <HorizontalTileCarousel items={tileItems} />
              </div>
            </section>
            <header>
              <div className="market-news-headline">Read market news</div>
            </header>
            <section className="news-section">
              <TopMovers />
              {loading
                ? <div>Loading</div>
                : news
              }
            </section>
          </section>
        </div>
        <Watchlist stocks={watchlist} />
      </div>
    </div>
  )
}

export default Dashboard;