import React from 'react';
import StockGraph from './stock_graph';
import { merge } from 'lodash';

class StockShow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      range: "1d",
    }
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchStocks(merge({}, this.state, { ticker: this.props.match.params.ticker}));
  }

  handleClick(value) {
    return () => {
      this.setState({ range: value}, () => {
      this.props.fetchStocks(merge({}, this.state, { ticker: this.props.match.params.ticker}));
    })}
  }

  componentDidUpdate(prevProps) {
    if(prevProps.ticker !== this.props.match.params.ticker) {
      this.props.fetchStocks(merge({}, this.state, { ticker: this.props.match.params.ticker}))
    }
  }


  render() {
    const stockInfo = Object.values(this.props.stock).map((stock) => {
      return { date: stock.date, time: stock.minute, price: stock.high }
    })
    let stockArr = [ stockInfo ]
    return (
      <div className="dashboard-test">
        This is Stock Show
        <StockGraph data={stockArr} />
        <button onClick={this.handleClick("1d")}>1D</button>
        <button onClick={this.handleClick("5dm")}>5D</button>
        <button onClick={this.handleClick("1mm")}>1M</button>
        <button onClick={this.handleClick("3m")}>3M</button>
        <button onClick={this.handleClick("1y")}>1Y</button>
        <button onClick={this.handleClick("5y")}>5Y</button>
      </div>
  
      )
    }
  }
  
  export default StockShow;
  
{/* <StockGraph  data={this.props.data}/> */}