import React from 'react';
import StockGraph from "../stock_show/stock_graph";
import { Link } from 'react-router-dom';

class WatchlistItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      watchlist: this.props.watchlist,
      stockPrices: {},
      range: { range: "1d" },
    }
  }

  componentDidMount() {
    let symbolArr = this.state.watchlist.map(watchlist => watchlist.ticker_symbol)    
    this.props.fetchBatchRequest(symbolArr).then(res => {      
      this.setState({ stockPrices: res })});
  }

  renderWatchlistItem() {
    let stockInfo = null;
    let stockBatch = Object.entries(this.state.stockPrices)    
    if (stockBatch.length > 0) {
      stockInfo = stockBatch.map(stock => {        
        let stockSymbol = stock[0]
        let stockPrices = stock[1].chart
        let lastNotNullPrice;
        stockPrices = stockPrices.map(stock => {
          if (stock.high !== null) {
            lastNotNullPrice = stock.high
            return stock;
          } else {
            stock.high = lastNotNullPrice;
            return stock;
          }
        });
        let graphInfo = stockPrices.map((stock, idx) => {
          return { date: stock.date, time: new Date(`${stock.date}T${stock.minute}:00`).toLocaleTimeString().split(" ")[0], price: stock.high, idx: idx }
        })
        let currentPrice = graphInfo.slice(-1)[0].price      
        return (
          <>
          <Link to={`/stock/${stockSymbol}`} className="watchlist-link">
              <li key={stockSymbol} className="watchlist-item">
                <div className="watchlist-item-container">
                  <div className="watchlist-ticker">
                    <h2>{stockSymbol}</h2>
                  </div>
                  <div className="watchlist-graph-container">
                    <StockGraph className="watchlist-graph" data={graphInfo} range={this.state.range} />
                  </div>
                  <div className="watchlist-price">
                    ${currentPrice}
                  </div>
                </div>
              </li>
            </Link>
          </>
        )
      })
    }    
    return stockInfo;
  }

  render() {            
    return (
      <>
        {this.renderWatchlistItem()}
      </>
    )
  }
}

export default WatchlistItem;



