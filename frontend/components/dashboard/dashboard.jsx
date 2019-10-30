import React from 'react';
import StockGraph from '../stock_show/stock_graph';
import NewsItem from '../stock_show/news_item'
import Watchlist from './watchlist_container';

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      range: { range: "1d" }, 
      news: [],
    }
    this.handleClick = this.handleClick.bind(this);
   }

  componentDidMount() {
    document.body.style.backgroundColor = "#1b1b1d";
    document.body.style.color = "white";
    document.getElementById("navbar-component").style.backgroundColor = "#1b1b1d"
    document.getElementById("nav-log-in-links").childNodes.forEach(el => el.style.color = "white");
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

  render() {
    const data = Object.values(this.props.portfolio)[0].transactions.map((transaction, idx) => {
      let date = transaction.created_at.split("T")[0]
      return { date: date, time: new Date(transaction.created_at).toLocaleTimeString().split(" ")[0], price: transaction.transaction_amount, idx: idx }
    });

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
            <input type="submit" className={`button-active-${this.state.range.range === "1d" ? true : false}`}  value={"1D"} />
            <input type="submit" className={`button-active-${this.state.range.range === "5d" ? true : false}`}  value={"1W"} />
            <input type="submit" className={`button-active-${this.state.range.range === "1m" ? true : false}`}  value={"1M"} />
            <input type="submit" className={`button-active-${this.state.range.range === "3m" ? true : false}`} value={"3M"} />
            <input type="submit" className={`button-active-${this.state.range.range === "1y" ? true : false}`} value={"1Y"} />
            <input type="submit" className={`button-active-${this.state.range.range === "5y" ? true : false}`} value={"5Y"} />
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