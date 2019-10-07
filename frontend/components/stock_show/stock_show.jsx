import React from 'react';
import StockGraph from './stock_graph';

class StockShow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      symbol: this.props.searchString,
      range: "1d",
    }
  }

  componentDidMount() {
    // let stockParams = { symbol: this.props.searchString, range: this.state.range }
    this.props.fetchStocks(this.state);
  }

  handleClick(value) {
    () => this.setState({ range: value }, () => {
      this.props.fetchStocks(this.state);
    })
  }

  render() {
    const stockInfo = Object.values(this.props.stock).map((stock, idx) => {
      return <li key={`stock-${idx}`}>{stock.minute}: {stock.high}</li>
    })

    return (
      <div className="dashboard-test">
        This is Stock Show
        <button onClick={() => this.handleClick("1d")}>1D</button>
        <button onClick={() => this.handleClick("5dm")}>5D</button>
        <button onClick={() => this.handleClick("1mm")}>1M</button>
        <button onClick={() => this.handleClick("3m")}>3M</button>
        <button onClick={() => this.handleClick("1y")}>1Y</button>
        <button onClick={() => this.handleClick("5y")}>5Y</button>
        <ul>
          {stockInfo}
        </ul>
      </div>
  
      )
    }
  }
  
  export default StockShow;
  
{/* <StockGraph  data={this.props.data}/> */}