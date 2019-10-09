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
    this.interval = setInterval(() => this.props.fetchStocks(merge({}, this.state.range, { ticker: this.props.match.params.ticker})), 60000);
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

  // calculateLowToday() {
  //   let lowest;
  //   this.props.stock.forEach((stock, idx) => {
  //     if (idx === 0) {
  //       lowest = stock.low;
  //     }
  //     if (stock.low <= lowest) {
  //       lowest = stock.low
  //     };
  //   });
  //   return lowest;
  // }

  handleChange() {
    return e => this.setState({form: {shares: e.target.value}}, () => {
      this.calculateOrderTotal()
    })
  }

  calculateOrderTotal() {
    if (this.state.form.shares.length > 0) {
      return parseInt(this.state.form.shares) * this.props.stock.slice(-1)[0].high
    } else {
      return 0
    }
  }

  render() {
    const stockInfo = this.props.stock.map(stock => {
      return { date: stock.date, time: new Date(`${stock.date}T${stock.minute}:00`).toLocaleTimeString().split(" ")[0], price: stock.high }
    });
    return (
      <div className="show-page-container">

        <div className="stock-show-container">
          <div className="company-header">
            <h1>{this.state.info.companyName}</h1>
          </div>
          <div className="graph-container">
            <StockGraph data={stockInfo} range={this.state.range}/>
          </div>
          <div className="range-buttons">
            <button onClick={this.handleClick("1d")}>1D</button>
            <button onClick={this.handleClick("5dm")}>5D</button>
            <button onClick={this.handleClick("1mm")}>1M</button>
            <button onClick={this.handleClick("3m")}>3M</button>
            <button onClick={this.handleClick("1y")}>1Y</button>
            <button onClick={this.handleClick("5y")}>5Y</button>
          </div>
          <div className="stock-info">
            <h2>About</h2>
            <div className="stock-description">
              {this.state.info.description}
            </div>
            <div className="info-subsets">
              <div>
                CEO <br/>
                {this.state.info.CEO}
              </div>
              <div>
                Employees <br/>
                {this.state.info.employees}
              </div>
              <div>
                Headquarters <br/>
                {this.state.info.city}, {this.state.info.state}
              </div>
              <div>
                Market Cap <br/>
                {this.formatNumber(this.state.keyStats.marketCap)}
              </div>
              <div>
                Price-Earnings Ratio <br/>
                {this.state.keyStats.peRatio}
              </div>
              <div>
                Average Volume <br/>
                {this.formatNumber(this.state.keyStats.avgTotalVolume)}
              </div>
              <div>
                High Today <br/>
                {this.calculateHighToday()}
              </div>
              <div>
                Low Today <br/>
                {/* {this.calculateLowToday()} */}
              </div>
              <div>
                Open Price <br/>
                {this.state.keyStats.open}
              </div>
              <div>
                Volume <br/>
                {this.state.keyStats.volume}
              </div>
              <div>
                52 Week High <br/>
                ${this.state.keyStats.week52High}
              </div>
              <div>
                52 Week Low <br/>
                ${this.state.keyStats.week52Low}
              </div>
            </div>
          </div>
        </div>
        <div className="transaction-container">
          <div className="transaction-form">
            <h2>Buy {this.state.info.symbol}</h2>
            <form>
              <label>
                Shares
                <input type="text" value={this.state.form.shares} onChange={this.handleChange()}/>
              </label>
              <p>Market Price<span>${this.props.stock.slice(-1).high}</span></p>
              <p>Estimated Cost {this.calculateOrderTotal()}</p>
              <input type="submit" value="Review Order"/>
              <p>${this.props.user.funds} Buying Power Available</p>
            </form>
          </div>
        </div>
      </div>
      )
    }
  }
  
  export default StockShow;
  
{/* <StockGraph  data={this.props.data}/> */}