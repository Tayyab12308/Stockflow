import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import StockGraph from '../stock_show/stock_graph';
import NewsItem from '../stock_show/news_item'
import WatchlistItem from './watchlist';
import { fetchAllNews, fetchPrices } from '../../util/stock_api_util';
import * as moment from 'moment';
import { fetchValidPricesForTicker, getTickerQuery, transformFinModelPrepRawData, VALID_RANGES } from '../../util/util';

const Dashboard = () => {
  const portfolio = useSelector(state => state.entities.users)

  const [range, setRange] = useState(VALID_RANGES.ONE_DAY);
  const [news, setNews] = useState([]);
  const [stockPrices, setStockPrices] = useState([]);

  useEffect(() => {
    document.body.style.backgroundColor = "#1b1b1d";
    document.body.style.color = "white";
    document.getElementById("navbar-component").style.backgroundColor = "#1b1b1d"
    document.getElementById("nav-log-in-links").childNodes.forEach(el => el.style.color = "white");

    let symbolArr = Object.keys(Object.values(portfolio)[0].total_stock_count);
    Promise.all(
      symbolArr.map(ticker =>
        fetchValidPricesForTicker(ticker)
          .then(res => ({ [ticker]: res }))
      )
    ).then(results => {
      const batchPrices = results.flatMap(obj =>
        Object.entries(obj).map(([symbol, quotes]) => ({ [symbol]: transformFinModelPrepRawData(quotes) }))
      );
      setStockPrices(batchPrices);
    })
    fetchAllNews().then(res => setNews(res.articles));

    return () => {
      document.body.style.backgroundColor = "white";
      document.getElementById("navbar-component").style.backgroundColor = "white";
      document.body.style.color = "black";
    }
  }, [fetchPrices, fetchAllNews, portfolio]);

  const handleClick = () => fetchAllNews().then(res => setNews(res.articles));

  const renderPortfolioValue = () => {
    let endRange;
    let historicalValue;
    switch (range) {
      case "1D":
        endRange = moment().format()
        historicalValue = handleDailyPortfolioCalc();
        break
      case "5D":
        endRange = moment().subtract(1, 'week').format().split("T")[0];
        let allFiveDayTransactions = filterTransactions(endRange);
        historicalValue = handleHistoricalPortfolioCalc(allFiveDayTransactions);
        break;
      case "1M":
        endRange = moment().subtract(1, 'month').format().split("T")[0];
        let allOneMonthTransactions = filterTransactions(endRange);
        historicalValue = handleHistoricalPortfolioCalc(allOneMonthTransactions);
        break;
      case "3M":
        endRange = moment().subtract(3, 'months').format().split("T")[0];
        let allThreeMonthTransactions = filterTransactions(endRange);
        historicalValue = handleHistoricalPortfolioCalc(allThreeMonthTransactions);
        break;
      case "1Y":
        endRange = moment().subtract(1, 'years').format().split("T")[0];
        let allOneYearTransactions = filterTransactions(endRange);
        historicalValue = handleHistoricalPortfolioCalc(allOneYearTransactions);
        break;
      case "5Y":
        endRange = moment().subtract(5, 'years').format().split("T")[0];
        let allFiveYearTransactions = filterTransactions(endRange);
        historicalValue = handleHistoricalPortfolioCalc(allFiveYearTransactions);
        break;
      default:
        return null;
    }
    return historicalValue;
  }

  const filterTransactions = (endRange) => {
    let allTransactions = Object.values(portfolio)[0].transactions;
    return allTransactions.filter(transaction => transaction.created_at.split("T")[0] >= endRange);
  }

  const handleDailyPortfolioCalc = () => {
    let portfolioInfo = Object.values(portfolio)[0].total_stock_count;
    let timeIndexedQuotes = {};
    stockPrices.forEach(obj => Object.entries(obj).forEach(([ticker, quotesArray]) => quotesArray.forEach(({ date, time, price }, idx) => {
      const totalValue = price * portfolioInfo[ticker];
      if (timeIndexedQuotes[time]) {
        timeIndexedQuotes[time].price = parseFloat((timeIndexedQuotes[time].price + totalValue).toFixed(2));
      } else {
        timeIndexedQuotes[time] = {
          date,
          time,
          price: totalValue,
          idx,
        };
      }
    })));
    return Object.values(timeIndexedQuotes);
  }

  const handleHistoricalPortfolioCalc = (transactions) => {
    console.log({ transactions })
    let portfolioValue = Object.values(portfolio)[0].portfolio_value;
    let currValue = parseFloat(portfolioValue);
    const a = transactions.map((transaction, idx) => {
      transaction.transaction_type === "Buy" ? currValue -= parseFloat(transaction.transaction_amount) : currValue += parseFloat(transaction.transaction_amount);
      let date = transaction.created_at.split("T")[0];
      return { date: date, time: new Date(transaction.created_at).toLocaleTimeString().split(" ")[0], price: currValue, idx: idx }
    });
    console.log({ a });
    return a;
  }

  const handleRangeChange = (e) => setRange(e.target.value);

  const getRangeButtons = () => Object.keys(VALID_RANGES).map((currRange, idx) => (
    <input type="submit"
      key={idx}
      className={`button-active-${range === VALID_RANGES[currRange]}`}
      onClick={handleRangeChange}
      value={VALID_RANGES[currRange]} 
    />
  ));
  
  const newsItems = news.map((article, idx) => <NewsItem key={idx} article={article} />);

  return (
    <div className="show-page-container">
      <div className="stock-show-container">
        <div className="graph-container">
          <StockGraph data={renderPortfolioValue()} range={range} />
        </div>
        <div className="range-buttons portfolio-range">
          {getRangeButtons()}
        </div>
        <div className="all-news">
          <h2>News</h2>
          <hr />
        </div>
        <div className="news-button-container">
          <button className="news-button" onClick={() => handleClick()}>Show Newer Articles</button>
        </div>
        <div className="news">
          {newsItems}
        </div>
      </div>
      <div className="watchlist-container">
        <div className="watchlist">
          <h2>Watchlist</h2>
          <ul className="watchlist-full-list">
            <WatchlistItem />
          </ul>
        </div>

      </div>
    </div>
  )
};

export default Dashboard;