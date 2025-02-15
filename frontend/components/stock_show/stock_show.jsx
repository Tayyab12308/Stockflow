import React, { useCallback, useEffect, useState } from 'react';
import StockGraph from './stock_graph';
import NewsItem from './news_item';
import Odometer from 'react-odometerjs';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocks } from '../../actions/stock_actions';
import { fetchCompany, fetchCompanyProfile, fetchKeyStats, fetchNews } from '../../util/stock_api_util';
import { addToWatchlist, createTransaction } from '../../actions/session_actions';
import { fetchValidPricesForTicker, getTickerQuery, transformFinModelPrepRawData, VALID_RANGES } from '../../util/util';

const StockShow = () => {
  const { ticker } = useParams();
  const dispatch = useDispatch();

  const user = useSelector(state => Object.values(state.entities.users)[0]);
  const errorsFromRedux = useSelector(state => state.errors.session);

  const [tickerQuery, setTickerQuery] = useState(getTickerQuery(ticker, VALID_RANGES.ONE_DAY));
  const [stockData, setStockData] = useState([]);
  const [info, setInfo] = useState({});
  const [keyStats, setKeyStats] = useState({});
  const [companyProfile, setCompanyProfile] = useState({});
  const [form, setForm] = useState({ shares: "" });
  const [news, setNews] = useState([])
  const [inWatchlist, setInWatchlist] = useState(null);
  const [orderType, setOrderType] = useState("BUY");
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);
  const [addedToWatchlist, setAddedToWatchlist] = useState(null);
  const [removeWatchlistClicked, setRemoveWatchlistClicked] = useState(0);
  const [removeWatchlistMessage, setRemoveWatchlistMesssage] = useState(null);

  // Transform the raw stock data from Redux (assuming rawStockData is stored as an object

  // Check if ticker is in user's watchlist
  const checkInWatchlist = useCallback(() => {
    if (user && user.watchlist) {
      const watchlistSymbols = user.watchlist.map(el => el.ticker_symbol);
      setInWatchlist(watchlistSymbols.includes(ticker));
    }
  }, [user, ticker])

  useEffect(() => {
    // set page styling
    document.body.style.backgroundColor = "#1b1b1d";
    document.body.style.color = "white";
    document.getElementById("navbar-component").style.backgroundColor = "#1b1b1d";
    document.getElementById("nav-log-in-links").childNodes.forEach(el => el.style.color = "white");

    // fetch stocks for ticker and range
    fetchValidPricesForTicker(ticker).then(res => setStockData(transformFinModelPrepRawData(res)));

    // Fetch company info, key stats, and news
    fetchCompany(ticker).then(res => setInfo(res));
    fetchKeyStats(ticker).then(res => setKeyStats(res["Global Quote"]));
    fetchCompanyProfile(ticker).then(companyProfileRes => {
      console.log({ companyProfileRes })
      fetchNews(companyProfileRes.companyName).then(newsRes => {
        console.log({ newsRes })
        setNews(newsRes.articles)
        setCompanyProfile(companyProfileRes[0]);
      });
    })

    checkInWatchlist();

    return () => {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
      document.getElementById("navbar-component").style.backgroundColor = "white"
      document.getElementById("nav-log-in-links").style.color = "white";
    }
  }, [ticker, tickerQuery, dispatch])


  const handleClick = (value) => () => {
    setTickerQuery(value);
    dispatch(fetchStocks(value));
  }

  const formatNumber = (num) => {
    const _suffix = ["K", "M", "B", "T"]
    if (num > 1000) {
      let i = 0
      while (num > 1000) {
        num /= 1000
        i += 1
      }
      return `${num.toFixed(2)}${_suffix[i - 1]}`
    }
    return num
  }

  const handleChange = () => e => {
    let regNum = /^[0-9]*$/
    if (regNum.test(e.target.value)) {
      setForm({ shares: e.target.value });
      calculateOrderTotal();
    }
  }

  const calculateOrderTotal = () => {
    if (form.shares.length > 0) {
      return (parseInt(form.shares) * stockData.slice(-1)[0].close).toFixed(2)
    }
    return 0.00
  }

  const handleWatchlistAction = (action) => (e) => {
    e.stopPropagation();
    let watchlistParams = { ticker_symbol: ticker };
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

  const renderWatchlistButton = () => {
    if (inWatchlist) {
      return <input type="submit"
        className="watchlist-button"
        onClick={handleWatchlistAction("remove")}
        value="Remove From Watchlist"
      />
    } else {
      return <input type="submit"
        className="watchlist-button"
        onClick={handleWatchlistAction("add")}
        value="Add to Watchlist"
      />
    }
  }

  const renderTotalStocks = () => {
    let symbol = ticker;
    let stockCount = user.total_stock_count;
    let stockSymbolCount = stockCount[symbol];
    if (orderType === "SELL") {
      let stockCount = stockSymbolCount !== undefined ? stockSymbolCount : 0
      return <div className="buying-power">You have <Odometer auto={false} value={stockCount} duration={3} format='(,ddd)' /> shares to sell</div>;
    } else {
      return <div className="buying-power">$<Odometer auto={false} value={user.funds} duration={3} format='(,ddd).dd' /> Buying Power Available</div>;
    }
  }

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

  const handleBuyOrder = () => (e) => {
    e.preventDefault();
    clearErrors();
    clearSuccess();
    let transactionParams = {
      ticker_symbol: ticker,
      transaction_amount: calculateOrderTotal(),
      stock_count: parseInt(form.shares),
      transaction_type: orderType,
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
      let watchlistParams = { ticker_symbol: ticker };
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
    const watchlistParams = { ticker_symbol: ticker };
    const currentlyInvested = user.total_stock_count;

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
        <img className="error-icon transaction-errors" src={window.invertedWarningIcon} />
        Please enter a valid number of shares
      </div>
    }
    if (orderType === "BUY") {
      let orderTotal = calculateOrderTotal();
      let orderDifference = user.funds - orderTotal;
      if (orderDifference < 0) {
        return <div className="login-errors transaction-errors">
          <p>
            <img className="error-icon" src={window.invertedWarningIcon} />
            You don't have enough buying power to buy {parseInt(form.shares)} shares of {ticker}.
          </p> <br />
          <p>
            Please deposit ${Math.abs(orderDifference)} to purchase {parseInt(form.shares)} shares at market price.
          </p>
        </div>
      }
    } else {
      let symbol = ticker;
      let stockCount = user.total_stock_count;
      let stockSymbolCount = stockCount[symbol];
      if (parseInt(form.shares) > stockSymbolCount) {
        return <div className="login-errors transaction-errors">
          <img className="error-icon" src={window.invertedWarningIcon} />
          You don't have enough enough stocks shares of {ticker}
          to complete this order. Please buy some more shares.
        </div>
      }
    }
  }

  const clearErrors = () => setErrors(null);

  const clearSuccess = () => {
    setSuccess(null);
    setAddedToWatchlist(null);
  };

  // clearWatchlistMessage() {
  //   setState({ removeWatchlistMessage: null })
  // }

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

  const stockNews = news.map((article, idx) => <NewsItem key={idx} article={article} />);

  const getRangeButtons = () => {
    return Object.keys(VALID_RANGES).map((range, idx) => {
      const currentTickerQuery = getTickerQuery(ticker, VALID_RANGES[range])
      return <input type="submit"
        key={idx}
        className={`button-active-${tickerQuery.range === VALID_RANGES[range]}`}
        onClick={handleClick(currentTickerQuery)}
        value={currentTickerQuery.value} />
    })
  }

  return (
    <div className="show-page-container">
      <div className="stock-show-container">
        <div className="company-header">
          <h1>{info.companyName}</h1>
        </div>
        <div className="graph-container">
          {stockData.length && <StockGraph
            className="stock-show-grpah"
            data={stockData} range={tickerQuery.range}
            initialPrice={stockData[stockData.length - 1].price.toFixed(2)}
            openingPrice={stockData?.[0]?.price} 
          />}
        </div>
        <hr className="graph-line" />
        <div className="range-buttons">
          {getRangeButtons()}
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
          <div className="news">
            {stockNews}
          </div>
        </div>
      </div>
      <div className="transaction-container">
        <div className="transaction-form">
          <div className="transaction-type-header">
            <button className={`transaction-header-${orderType === "BUY"}`} onClick={handleBuy()}>Buy <span>{ticker}</span></button>
            <button className={`transaction-header-${orderType === "SELL"}`} onClick={handleSell()}>Sell <span>{ticker}</span></button>
          </div>
          <hr className="transaction-break" />
          <div>
            <form className="transaction-form-item">
              <div className="transaction-form-row">
                <span>Shares</span>
                <input className="transaction-input" type="text" value={form.shares} onChange={handleChange()} placeholder="0" />
              </div>
              <div className="transaction-form-row">
                <p>Market Price</p> <span>${stockData?.[stockData?.length - 1]?.price?.toFixed(2) || 0}</span>
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
  )
}

export default StockShow;
