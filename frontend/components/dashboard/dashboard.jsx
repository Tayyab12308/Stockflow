import React from 'react';

class Dashboard extends React.Component {
  // constructor(props) {
  //   super(props)
  //   debugger
  //   // const { date, minute, label, high, low, open, close, average, volume, notional, numberOfTrades } = this.props.stock
  // }

  componentDidMount() {
    document.body.style.backgroundColor = "#1b1b1d";
    document.body.style.color = "white";
    document.getElementById("navbar-component").style.backgroundColor = "#1b1b1d"
    document.getElementById("nav-log-in-links").childNodes.forEach(el => el.style.color = "white");
  }

  componentWillUnmount() {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
  }


  render() {
    return (
      <div className="dashboard-test">
        This is dashboard
      </div>

    )
  }
}

export default Dashboard;