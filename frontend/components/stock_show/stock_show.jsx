import React from 'react';
import StockGraph from './stock_graph';
import { merge } from 'lodash';

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
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchStocks(merge({}, this.state.range, { ticker: this.props.match.params.ticker }));
    this.props.fetchCompany(this.props.match.params.ticker).then(res => this.setState({ info: res }));
    this.props.fetchKeyStats(this.props.match.params.ticker).then(res => this.setState({ keyStats: res }));
    // this.interval = setInterval(() => this.props.fetchStocks(merge({}, this.state.range, { ticker: this.props.match.params.ticker})), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval)
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
    return e => this.setState({form: {shares: e.target.value}}, () => {
      this.calculateOrderTotal()
    })
  }

  calculateOrderTotal() {
    if (this.state.form.shares.length > 0) {
      return (parseInt(this.state.form.shares) * this.props.stock.slice(-1)[0].high).toFixed(2)
    } else {
      return 0
    }
  }

  render() {
    const stockInfo = this.props.stock.map((stock, idx) => {
      return { date: stock.date, time: new Date(`${stock.date}T${stock.minute}:00`).toLocaleTimeString().split(" ")[0], price: stock.high, idx: idx }
    });

    const initalPrice = () => {
      if (stockInfo.length > 0) {    
      for (let i = stockInfo.length - 1; i >= 0; i--) {
        if (stockInfo[i].price !== null) {        
          return stockInfo[i].price;
        }
      }    
      return 0
    }
  }

  const pricee = initalPrice()
    return (
      <div className="show-page-container">

        <div className="stock-show-container">
          <div className="company-header">
            <h1>{this.state.info.companyName}</h1>
          </div>
          <div className="graph-container">
            {pricee && <StockGraph data={stockInfo} range={this.state.range} initialPrice={pricee}/>}
          </div>
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
          </div>
        </div>
        <div className="transaction-container">
          <div className="transaction-form">
            <div>
              <h2>Buy <span>{this.state.info.symbol}</span></h2>
            </div>
            <hr className="transaction-break"/>
            <div>
              <form className="transaction-form-item">
                <div>
                  <label>
                    Shares
                    <input className="transaction-input" type="text" value={this.state.form.shares} onChange={this.handleChange()}/>
                  </label>
                </div>
                <div>
                  <p>Market Price<span>${this.props.stock.slice(-1).high}</span></p>
                </div>
                <hr className="transaction-break" />
                <div>
                  <p>Estimated Cost <span>{this.calculateOrderTotal()}</span></p>
                </div>
                <div>
                  <input type="submit" value="Place Order"/>
                </div>
                <hr className="transaction-break" />
                <div>
                  <p>${this.props.user.funds} Buying Power Available</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      )
    }
  }
  
  export default StockShow;
  
{/* <StockGraph  data={this.props.data}/> */}