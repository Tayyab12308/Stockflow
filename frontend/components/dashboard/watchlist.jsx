import React from 'react';
import StockGraph from "../stock_show/stock_graph";

class WatchlistItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stockPrices: {},
      range: { range: "1d" },
    }
  }

  componentDidMount() {
    let symbolArr = this.props.watchlist.map(watchlist => watchlist.ticker_symbol)    
    this.props.fetchBatchRequest(symbolArr).then(res => {      
      this.setState({ stockPrices: res })});
  }

  renderWatchlistItem() {
    let stockInfo = null;
    let stockBatch = Object.entries(this.state.stockPrices)
    debugger
    if (stockBatch.length > 0) {
      stockInfo = stockBatch.map(stock => {
        debugger
        let stockSymbol = stock[0]
        let stockPrices = stock[1].chart
        let graphInfo = stockPrices.map((stock, idx) => {
          return { date: stock.date, time: new Date(`${stock.date}T${stock.minute}:00`).toLocaleTimeString().split(" ")[0], price: stock.high, idx: idx }
        })
        let currentPrice = graphInfo.slice(-1).price
        return (
          <>
            <li key={stockSymbol} className="watchlist-item">
              <div className="watchlist-item-container">
                <div className="watchlist-ticker">
                  <h2>{stockSymbol}</h2>
                </div>
                <div className="watchlist-graph-container">
                  <StockGraph className="watchlist-graph" data={graphInfo} range={this.state.range} />
                </div>
                <div className="watchlist-price">
                  {currentPrice}
                </div>
              </div>
            </li>
          </>
        )
      })
    }
    debugger
    return stockInfo;
  }

  render() {    
    
    debugger
    return (
      <>
        {this.renderWatchlistItem()}
      </>
    )
  }
}

export default WatchlistItem;



