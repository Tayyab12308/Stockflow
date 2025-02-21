import React, { useEffect, useState } from 'react';
import StockGraph from "../stock_show/stock_graph";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchPrices } from '../../util/stock_api_util';
import { fetchValidPricesForTicker, getTickerQuery, transformFinModelPrepRawData, VALID_RANGES } from '../../util/util';

const WatchlistItem = () => {
  const watchlist = useSelector(state => Object.values(state.entities.users)[0].watchlist);
  const currentlyInvested = useSelector(state => Object.values(state.entities.users)[0].total_stock_count);
  const [stockPrices, setStockPrices] = useState([]);

  useEffect(() => {
    Promise.all(
      watchlist.map(watchlist => watchlist.ticker_symbol).map(ticker =>
        fetchValidPricesForTicker(ticker)
          .then(res => ({ [ticker]: res }))
      )
    ).then(results => {
      const batchPrices = results.flatMap(obj =>
        Object.entries(obj).map(([symbol, quotes]) => ({ [symbol]: transformFinModelPrepRawData(quotes)}))
      );
      setStockPrices(batchPrices);
    });
  }, [watchlist]);

  return stockPrices.map(obj => Object.entries(obj).map(([symbol, quotesArray], idx) => (quotesArray.length > 0 &&
      <>
        <Link to={`/stock/${symbol}`} className="watchlist-link">
          <li key={idx} className="watchlist-item">
            <div className="watchlist-item-container">
              <div className="watchlist-ticker">
                <h2>{symbol}</h2>
                {currentlyInvested[symbol] && <div className="shares-owned">{currentlyInvested[symbol]} shares</div>}
              </div>
              <div className="watchlist-graph-container">
                <StockGraph className="watchlist-graph" data={quotesArray} range={VALID_RANGES.ONE_DAY} />
              </div>
              <div className="watchlist-price">
                ${quotesArray[quotesArray.length - 1].close}
              </div>
            </div>
          </li>
        </Link>
      </>
    )
  ))
};

export default WatchlistItem;



