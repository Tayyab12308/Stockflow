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

  render() {    
    let stockInfo;
    if (Object.values(this.state.stockPrices).length > 0) {      
      let stocks = Object.values(this.state.stockPrices)
      stockInfo = Object.values(stocks).map(item => {
        item.chart.map((stock, idx) => {          
          let graphInfo = { date: stock.date, time: new Date(`${stock.date}T${stock.minute}:00`).toLocaleTimeString().split(" ")[0], price: stock.high, idx: idx }          
          return (
            <>  
              <div className="watchlist-item">
                <div className="watchlist-ticker">
                  <h2>{this.props.watchlist.ticker_symbol}</h2>
                </div>
                <div className="watchlist-graph-container">
                  <StockGraph data={graphInfo} range={this.state.range} />
                </div>
                <div className="stockInfo">
                  {this.state.stockPrices.high}
                </div>
              </div>
            </>    
          )
        })
      })
    } else {
    stockInfo = <div></div>
    }
    return (
      <>
        {stockInfo}
      </>
    )
  }
}

export default WatchlistItem;



