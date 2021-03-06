import React from 'react';
import StockGraph from './stock_graph';
import { merge } from 'lodash';
import NewsItem from './news_item';
import Odometer from 'react-odometerjs';

class StockShow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      range: { range: "1d"},
      info: {},
      keyStats: {},
      form: {
        shares: "",
      },
      news: [],
      inWatchlist: null,
      orderType: "BUY",
      errors: null,
      success: null,
      addedToWatchlist: null,
      removeWatchlistClicked: 0,
      removeWatchlistMessage: null,
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderWatchlistButton = this.renderWatchlistButton.bind(this);
    this.handleWatchlistAction = this.handleWatchlistAction.bind(this);
    this.handleBuyOrder = this.handleBuyOrder.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
    this.handleSell = this.handleSell.bind(this);
    this.renderTotalStocks = this.renderTotalStocks.bind(this);
    this.afterBuyAction = this.afterBuyAction.bind(this);
    this.handleFirstBuy = this.handleFirstBuy.bind(this);
    this.removeFromWatchlist = this.removeFromWatchlist.bind(this);
  }

  componentDidMount() {
    document.body.style.backgroundColor = "#1b1b1d";
    document.body.style.color = "white";
    document.getElementById("navbar-component").style.backgroundColor = "#1b1b1d";
    document.getElementById("nav-log-in-links").childNodes.forEach(el => el.style.color = "white");
    this.props.fetchStocks(merge({}, this.state.range, { ticker: this.props.match.params.ticker }));
    this.props.fetchCompany(this.props.match.params.ticker).then(res => this.setState({ info: res }));
    this.props.fetchKeyStats(this.props.match.params.ticker).then(res => this.setState({ keyStats: res }));
    this.props.fetchNews(this.props.match.params.ticker).then(res => this.setState({ news: res.articles }));
    this.inWatchlist();
    // this.interval = setInterval(() => this.props.fetchStocks({ range: this.state.range.range, 
    //                                                            ticker: this.props.match.params.ticker 
    //                                                           }), 60000);
  }

  componentWillUnmount() {
    // clearInterval(this.interval)
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    document.getElementById("navbar-component").style.backgroundColor = "white"
    document.getElementById("nav-log-in-links").style.color = "white";
  }

  handleClick(value) {
    return () => {
      this.setState({ range: { range: value}}, () => {
      this.props.fetchStocks(merge({}, this.state.range, { ticker: this.props.match.params.ticker}));
    })}
  }

  componentDidUpdate(prevProps) {    
    if(prevProps.ticker !== this.props.match.params.ticker) {      
      this.props.fetchStocks(merge({}, this.state.range, { ticker: this.props.match.params.ticker}))
      this.props.fetchCompany(this.props.match.params.ticker).then(res => this.setState({ info: res }));      
      this.props.fetchKeyStats(this.props.match.params.ticker).then(res => this.setState({ keyStats: res }));
      this.inWatchlist()
    }
  }

  formatNumber(num) {
    const _suffix = ["K", "M", "B", "T"]
    if (num > 1000) {
      let i = 0
      while (num > 1000) {
        num /= 1000
        i += 1
      }
      return `${num.toFixed(2)}${_suffix[i - 1]}`
    } else {
      return num
    }
  }

  calculateHighToday() {
    let highest = 0;
    this.props.stock.forEach(stock => {
      if (stock.high > highest) highest = stock.high;
    });
    return highest;
  }

  calculateLowToday() {    
    let lowest = null;
    if (this.props.stock.length > 0) {
      lowest = this.props.stock[0].low
      this.props.stock.forEach(stock => {
        if (!lowest || stock.low <= lowest) lowest = stock.low;
      });
    }    
    return lowest;
  }

  handleChange() {
    return e => {
      let regNum = /^[0-9]*$/
      if (regNum.test(e.target.value)) this.setState({form: {shares: e.target.value}}, () => this.calculateOrderTotal());
    }
  }

  calculateOrderTotal() {
    if (this.state.form.shares.length > 0) {
      return (parseInt(this.state.form.shares) * this.props.stock.slice(-1)[0].high).toFixed(2)
    } else {
      return 0.00
    }
  }

  inWatchlist() {
    const watchlistSymbols = this.props.user.watchlist.map(el => el.ticker_symbol)
    this.setState({ inWatchlist: watchlistSymbols.includes(this.props.match.params.ticker) });
  }

  handleWatchlistAction(action) {
    return (e) => {
      e.stopPropagation();
      let watchlistParams = { ticker_symbol: this.props.match.params.ticker };
      if (action === "add") {
        this.props.addToWatchlist(watchlistParams)
        .then(() => this.setState({ inWatchlist: !(this.state.inWatchlist), removeWatchlistMessage: null, removeWatchlistClicked: 0 }))
       } else {
          this.removeFromWatchlist()
       }
    }
  }

  renderWatchlistButton() {
    if (this.state.inWatchlist) {
      return <input type="submit" 
                    className="watchlist-button" 
                    onClick={this.handleWatchlistAction("remove")} 
                    value="Remove From Watchlist" 
              />
    } else {
      return <input type="submit" 
                    className="watchlist-button" 
                    onClick={this.handleWatchlistAction("add")} 
                    value="Add to Watchlist" 
              />
    }
  }

  renderTotalStocks() {
    let symbol = this.props.match.params.ticker;
    let stockCount = this.props.user.total_stock_count;
    let stockSymbolCount = stockCount[symbol];
    if (this.state.orderType === "SELL") {
      let stockCount = stockSymbolCount !== undefined ? stockSymbolCount : 0
      return <div className="buying-power">You have <Odometer auto={false} value={stockCount} duration={3} format='(,ddd)' /> shares to sell</div>;
    } else {
      return <div className="buying-power">$<Odometer auto={false} value={this.props.user.funds} duration={3} format='(,ddd).dd' /> Buying Power Available</div>;
    }
  }

  handleBuy() {
    return () => {
      this.clearErrors();
      this.clearSuccess();
      this.setState({ form: { shares: "" }, orderType: "BUY" }, () => this.formatOrderType());
    }
  }

  handleSell() {
    return () => {
      this.clearErrors();
      this.clearSuccess();
      this.setState({ form: { shares: "" }, orderType: "SELL" }, () => this.formatOrderType());
    }
  }

  handleBuyOrder() {
    return (e) => {
      e.preventDefault();
      this.clearErrors();
      this.clearSuccess();
      let transactionParams = {
        ticker_symbol: this.props.match.params.ticker,
        transaction_amount: this.calculateOrderTotal(),
        stock_count: parseInt(this.state.form.shares),
        transaction_type: this.state.orderType,
      }
      this.props.createTransaction(transactionParams)
      .then(() => this.afterBuyAction())
      .then(() => this.setState({ form: { shares: "" }, success: this.renderSuccess()}), () => this.setState({ errors: this.renderErrors()}))      
    }
  }

  afterBuyAction() {
    if (this.state.inWatchlist === false && this.state.orderType === "BUY") {      
      let watchlistParams = { ticker_symbol: this.props.match.params.ticker };
      let s = this.props.addToWatchlist(watchlistParams)
      .then(() => {         
        this.handleFirstBuy();        
      })
    }    
  }

  handleFirstBuy() {    
    this.setState({
      inWatchlist: !(this.state.inWatchlist),
      addedToWatchlist: <div className="login-errors">This stock has automatically been added to your watchlist so you can easily track changes in price</div>,
    })    
  }

  removeFromWatchlist() {
    let watchlistParams = { ticker_symbol: this.props.match.params.ticker };
    debugger
    let currentlyInvested = this.props.user.total_stock_count
    if (currentlyInvested[this.props.match.params.ticker] > 0 && this.state.removeWatchlistClicked < 1) {
      this.setState({ removeFromWatchlist: this.state.removeWatchlistClicked += 1,
        removeWatchlistMessage: <div className="login-errors">It is not recommended to remove a stock you are currently invested in from your watchlist. If you would still like to remove {this.props.match.params.ticker} from your watchlist please push the button one more time</div>,
       })
    } else {
      this.props.deleteFromWatchlist(watchlistParams)
      .then(() => this.setState({ inWatchlist: !(this.state.inWatchlist), removeWatchlistMessage: null, removeWatchlistClicked: 0 }))

    }
  }

  formatOrderType() {
    return `Place ${this.state.orderType[0] + this.state.orderType.slice(1).toLowerCase()} Order`
  }

  renderErrors() {    
    if (Object.values(this.props.errors).length > 0) {      

      if (this.state.form.shares.length < 1) {        
        return <div className="login-errors">
                                <img className="error-icon transaction-errors" src={window.invertedWarningIcon} />
                                  Please enter a valid number of shares
                                </div>
      } 
      if (this.state.orderType === "BUY") {        
        let orderTotal = this.calculateOrderTotal();
        let orderDifference = this.props.user.funds - orderTotal;
        if (orderDifference < 0) {          
          return <div className="login-errors transaction-errors">
                                    <p>
                                      <img className="error-icon" src={window.invertedWarningIcon} />
                                      You don't have enough buying power to buy {parseInt(this.state.form.shares)}
                                      shares of {this.props.match.params.ticker}.
                                    </p> <br/> 
                                    <p>
                                      Please deposit ${Math.abs(orderDifference)} to purchase 
                                      {parseInt(this.state.form.shares)} shares at market price.
                                    </p>
                                  </div>
        }
      } else {        
        let symbol = this.props.match.params.ticker;
        let stockCount = this.props.user.total_stock_count;
        let stockSymbolCount = stockCount[symbol];        
        if (parseInt(this.state.form.shares) > stockSymbolCount) {          
          return <div className="login-errors transaction-errors">
                                    <img className="error-icon" src={window.invertedWarningIcon} />
                                    You don't have enough enough stocks shares of {this.props.match.params.ticker}
                                    to complete this order. Please buy some more shares.
                                  </div>
        }
      }
    }
  }

  clearErrors() {
    this.setState({ errors: null });
  }

  clearSuccess() {
    this.setState({ success: null, addedToWatchlist: null })
  }

  // clearWatchlistMessage() {
  //   this.setState({ removeWatchlistMessage: null })
  // }

  renderSuccess() {
    if (this.state.orderType === "BUY") {      
      return (
        <>
          <div className="login-errors">
            Congratulations! You just bought {this.state.form.shares} shares of {this.props.match.params.ticker}
          </div>
        </>
      )
    } else {
      return <div className="login-errors">
              Congratulations! You just sold {this.state.form.shares} shares of {this.props.match.params.ticker}
             </div>
    }
  }

  renderStockInfo() {
    let lastNotNullPrice;
    let stockInfo = this.props.stock.map((stock, idx) => {
      if (stock.high !== null) {
        lastNotNullPrice = stock.high
      } else {
        stock.high = lastNotNullPrice;
      };
      return {
        date: stock.date,
        time: new Date(`${stock.date}T${stock.minute}:00`).toLocaleTimeString().split(" ")[0],
        price: stock.high,
        idx: idx,
      }
    }
    );
    return stockInfo;
  }

  calcInitalPrice() {
    let stockInfo = this.renderStockInfo();
    if (stockInfo.length > 0) {
      for (let i = stockInfo.length - 1; i >= 0; i--) {
        if (stockInfo[i].price !== null) {
          return stockInfo[i].price.toFixed(2);
        }
      }
      return 0.00
    }
  }

  calcOpeningPrice() {
    let stockInfo = this.renderStockInfo();
    if (stockInfo.length > 0) {
      return stockInfo[0].price;
    }
  }

  render() {
    const stockNews = this.state.news.map((article, idx) => {
      return <NewsItem key={idx} article={article} />
    });

    const stockInfo = this.renderStockInfo()
    const initialPrice = this.calcInitalPrice();
    const openingPrice = this.calcOpeningPrice();
    return (
      <div className="show-page-container">

        <div className="stock-show-container">
          <div className="company-header">
            <h1>{this.state.info.companyName}</h1>
          </div>
          <div className="graph-container">
            {initialPrice && <StockGraph className="stock-show-grpah" data={stockInfo} range={this.state.range} initialPrice={initialPrice} openingPrice={openingPrice}/>}
          </div>
          <hr className="graph-line" />
          <div className="range-buttons">
            <input type="submit" className={`button-active-${this.state.range.range === "1d" ? true : false}`} onClick={this.handleClick("1d")} value={"1D"}/>
            <input type="submit" className={`button-active-${this.state.range.range === "5dm" ? true : false}`} onClick={this.handleClick("5dm")} value={"1W"}/>
            <input type="submit" className={`button-active-${this.state.range.range === "1mm" ? true : false}`} onClick={this.handleClick("1mm")} value={"1M"}/>
            <input type="submit" className={`button-active-${this.state.range.range === "3m" ? true : false}`} onClick={this.handleClick("3m")} value={"3M"}/>
            <input type="submit" className={`button-active-${this.state.range.range === "1y" ? true : false}`} onClick={this.handleClick("1y")} value={"1Y"}/>
            <input type="submit" className={`button-active-${this.state.range.range === "5y" ? true : false}`} onClick={this.handleClick("5y")} value={"5Y"}/>
          </div>
          <div className="stock-info">
            <hr/>
            <h2>About</h2>
            <hr/>
            <div className="stock-description">
              {this.state.info.description}
            </div>
            <div className="info-subsets">
              <div className="info-row">
                <div>
                  <div className="info-subheader">CEO</div> <br/>
                  {this.state.info.CEO}
                </div>
                <div>
                  <div className="info-subheader">Employees</div> <br/>
                  {this.state.info.employees}
                </div>
                <div>
                  <div className="info-subheader">Headquarters</div> <br/>
                  {this.state.info.city}, {this.state.info.state}
                </div>
                <div>
                  <div className="info-subheader">Market Cap</div> <br/>
                  {this.formatNumber(this.state.keyStats.marketCap)}
                </div>
              </div>
              <div className="info-row">
                <div>
                  <div className="info-subheader">Price-Earnings Ratio</div> <br/>
                  {this.state.keyStats.peRatio}
                </div>
                <div>
                  <div className="info-subheader">Average Volume</div> <br/>
                  {this.formatNumber(this.state.keyStats.avgTotalVolume)}
                </div>
                <div>
                  <div className="info-subheader">High Today</div> <br/>
                  {this.calculateHighToday()}
                </div>
                <div>
                  <div className="info-subheader">Low Today</div> <br/>
                  {this.calculateLowToday()}
                </div>
              </div>
              <div className="info-row">
                <div>
                  <div className="info-subheader">Open Price</div> <br/>
                  {this.state.keyStats.open}
                </div>
                <div>
                  <div className="info-subheader">Volume</div> <br/>
                  {this.state.keyStats.volume}
                </div>
                <div>
                  <div className="info-subheader">52 Week High</div> <br/>
                  ${this.state.keyStats.week52High}
                </div>
                <div>
                  <div className="info-subheader">52 Week Low</div> <br/>
                  ${this.state.keyStats.week52Low}
                </div>
              </div>
            </div>
            <div>
              <h2>News</h2>
              <hr/>
            </div>
            <div className="news">
              {stockNews}
            </div>
          </div>
        </div>
        <div className="transaction-container">
          <div className="transaction-form">
            <div className="transaction-type-header">
              <button className={`transaction-header-${this.state.orderType === "BUY"}`} onClick={this.handleBuy()}>Buy <span>{this.state.info.symbol}</span></button>
              <button className={`transaction-header-${this.state.orderType === "SELL"}`} onClick={this.handleSell()}>Sell <span>{this.state.info.symbol}</span></button>
            </div>
            <hr className="transaction-break"/>
            <div>
              <form className="transaction-form-item">
                <div className="transaction-form-row">
                    <span>Shares</span>
                    <input className="transaction-input" type="text" value={this.state.form.shares} onChange={this.handleChange()} placeholder="0" />
                </div>
                <div className="transaction-form-row">
                  <p>Market Price</p> <span>${initialPrice}</span>
                </div>
                <hr className="transaction-break" />
                <div className="transaction-form-row">
                  <p>Estimated Cost</p> <span>${this.calculateOrderTotal()}</span>
                </div>
                <div>
                  {this.state.errors} {this.state.success} {this.state.addedToWatchlist}
                </div>
                <div>
                  <button className="transaction-submit" type="submit" onClick={this.handleBuyOrder()}>{this.formatOrderType()}</button>
                </div>
                <hr className="transaction-break" />
                <div>
                  {this.renderTotalStocks()}
                </div>
              </form>
            </div>
          <div className="watchlist-button-container">
            {this.renderWatchlistButton()}
          </div>
          <div>
            {this.state.removeWatchlistMessage}
          </div>
          </div>
        </div>
      </div>
      )
    }
  }
  
  export default StockShow;
  