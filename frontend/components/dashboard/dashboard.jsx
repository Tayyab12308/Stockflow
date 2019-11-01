import React from 'react';
import StockGraph from '../stock_show/stock_graph';
import NewsItem from '../stock_show/news_item'
import Watchlist from './watchlist_container';
import * as moment from 'moment';

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      range: { range: "1D" }, 
      news: [],
      stockPrices: {},
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);
   }

  componentDidMount() {
    document.body.style.backgroundColor = "#1b1b1d";
    document.body.style.color = "white";
    document.getElementById("navbar-component").style.backgroundColor = "#1b1b1d"
    document.getElementById("nav-log-in-links").childNodes.forEach(el => el.style.color = "white");
    let symbolArr = Object.keys(Object.values(this.props.portfolio)[0].total_stock_count)
    this.props.fetchBatchRequest(symbolArr).then(res => this.setState({ stockPrices: res }));
    this.props.fetchAllNews().then(res => this.setState({ news: res.articles }))
  }

  componentWillUnmount() {
    document.body.style.backgroundColor = "white";
    document.getElementById("navbar-component").style.backgroundColor = "white"
    document.body.style.color = "black";
  }

  handleClick() {
    this.props.fetchAllNews().then(res => this.setState({ news: res.articles }))
  }

  renderPortfolioValue() {
    let endRange;
    let historicalValue;
    switch (this.state.range.range) {
      case "1D":
        endRange = moment().format()
        historicalValue = this.handleDailyPortfolioCalc();
        break
      case "5D":
        endRange = moment().subtract(5, 'days').format().split("T")[0];
        let allFiveDayTransactions = this.filterTransactions(endRange);
        historicalValue = this.handleHistoricalPortfolioCalc(allFiveDayTransactions);
        break;
      case "1M":
        endRange = moment().subtract(1, 'month').format().split("T")[0];
        let allOneMonthTransactions = this.filterTransactions(endRange);
        historicalValue = this.handleHistoricalPortfolioCalc(allOneMonthTransactions);
        break;
      case "3M":
        endRange = moment().subtract(3, 'months').format().split("T")[0];
        let allThreeMonthTransactions = this.filterTransactions(endRange);
        historicalValue = this.handleHistoricalPortfolioCalc(allThreeMonthTransactions);
        break;
      case "1Y":
        endRange = moment().subtract(1, 'years').format().split("T")[0];
        let allOneYearTransactions = this.filterTransactions(endRange);
        historicalValue = this.handleHistoricalPortfolioCalc(allOneYearTransactions);
        break;
      case "5Y":
        endRange = moment().subtract(5, 'years').format().split("T")[0];
        let allFiveYearTransactions = this.filterTransactions(endRange);
        historicalValue = this.handleHistoricalPortfolioCalc(allFiveYearTransactions);
        break;
      default:
        return null;
    }
    return historicalValue;
  }

  filterTransactions(endRange) {
    let allTransactions = Object.values(this.props.portfolio)[0].transactions;
    return allTransactions.filter(transaction => transaction.created_at.split("T")[0] >= endRange);
  }

  handleDailyPortfolioCalc() {
    let allStocks = this.state.stockPrices;
    let portfolioInfo = Object.values(this.props.portfolio)[0].total_stock_count;
    let newInfo = {};
    Object.entries(allStocks).map(stockArr => {
      let stockSymbol = stockArr[0];
      let stockPrices = stockArr[1].chart;
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
      let stockInfo = stockPrices.filter(el => el !== undefined);
      stockInfo.map(stock => {
        let time = new Date(`${stock.date}T${stock.minute}:00`).toLocaleTimeString().split(" ")[0];
        let price = stock.high * portfolioInfo[stockSymbol]
        newInfo[time] = { date: stock.date, 
            price: (newInfo[time] === undefined) ? price: parseFloat((newInfo[time]["price"] += price).toFixed(2)),
            time, 
        } 
      })
    });
    let allInfo = Object.values(newInfo);
    debugger
    return allInfo.map((el, idx) => Object.assign(el, { idx }))
  }

  handleHistoricalPortfolioCalc(transactions) {
    let portfolioValue = Object.values(this.props.portfolio)[0].portfolio_value;
    let currValue = portfolioValue
    let allValues = transactions.map((transaction, idx) => {
      transaction.transaction_type === "Buy" ? currValue -= transaction.transaction_amount : currValue += transaction.transaction_amount;
      let date = transaction.created_at.split("T")[0];
      return { date: date, time: new Date(transaction.created_at).toLocaleTimeString().split(" ")[0], price: currValue, idx: idx }
    })
    // debugger
    return allValues;
  }

  handleRangeChange(value) {
    return () => this.setState({ range: { range: value}})
  }

  render() {
    const data = this.renderPortfolioValue()
    debugger
    const news = this.state.news.map((article, idx) => {
      return <NewsItem key={idx} article={article} />
    })

    return (
      <div className="show-page-container">
        <div className="stock-show-container">
          <div className="graph-container">
            <StockGraph data={data} range={this.state.range}/>
          </div>
          <div className="range-buttons portfolio-range">
            <input type="submit" className={`button-active-${this.state.range.range === "1D" ? true : false}`} value={"1D"} onClick={this.handleRangeChange("1D")} />
            <input type="submit" className={`button-active-${this.state.range.range === "5D" ? true : false}`} value={"1W"} onClick={this.handleRangeChange("5D")}/>
            <input type="submit" className={`button-active-${this.state.range.range === "1M" ? true : false}`} value={"1M"} onClick={this.handleRangeChange("1M")}/>
            <input type="submit" className={`button-active-${this.state.range.range === "3M" ? true : false}`} value={"3M"} onClick={this.handleRangeChange("3M")}/>
            <input type="submit" className={`button-active-${this.state.range.range === "1Y" ? true : false}`} value={"1Y"} onClick={this.handleRangeChange("1Y")}/>
            <input type="submit" className={`button-active-${this.state.range.range === "5Y" ? true : false}`} value={"5Y"} onClick={this.handleRangeChange("5Y")}/>
          </div>
          <div className="all-news">
            <h2>News</h2>
            <hr/>
          </div>
          <div className="news-button-container">
            <button className="news-button" onClick={() => this.handleClick()}>Show Newer Articles</button>
          </div>
          <div className="news">
            {news}
          </div>
        </div>
        <div className="watchlist-container">
          <div className="watchlist">
            <h2>Watchlist</h2>
            <ul className="watchlist-full-list">
              <Watchlist />
            </ul>
          </div>
          
        </div>
      </div>
    )
  }
}

export default Dashboard;