import React from 'react';

class Dashboard extends React.Component {
  // constructor(props) {
  //   super(props)
  //   debugger
  //   // const { date, minute, label, high, low, open, close, average, volume, notional, numberOfTrades } = this.props.stock
  // }

  // componentDidMount() {
  //   let stockParams = { symbol: "GOOG", range: "1d"}
  //   this.props.fetchStocks(stockParams);
  // }
  render() {
    return (
      <div className="dashboard-test">
        This is dashboard
      </div>

    )
  }
}

export default Dashboard;