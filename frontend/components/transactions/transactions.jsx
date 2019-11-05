import React from 'react';
import moment from 'moment';

class Transactions extends React.Component {

  componentDidMount() {
    document.body.style.backgroundColor = "#1b1b1d";
    document.body.style.color = "white";
    document.getElementById("navbar-component").style.backgroundColor = "#1b1b1d";
    document.getElementById("nav-log-in-links").childNodes.forEach(el => el.style.color = "white");
  }

  componentWillUnMount() {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    document.getElementById("navbar-component").style.backgroundColor = "white"
    document.getElementById("nav-log-in-links").style.color = "white";
  }

  renderTransactionData() {
    return this.props.transactions.map((transaction, idx) => {
      const { ticker_symbol, transaction_amount, transaction_type, created_at } = transaction;
      let dateObj = moment(created_at).format('LLLL').split(" ");
      let date = dateObj.slice(0, 4).join(" ");
      let time = dateObj.slice(4).join(" ");
      return (
        <tr key={idx}>
          <td>{ticker_symbol}</td>
          <td>{transaction_amount}</td>
          <td>{transaction_type}</td>
          <td>{date}</td>
          <td>{time}</td>
        </tr>
      )
    })
  }

  render() {
    console.log(moment("2019-10-11T02:16:33.841Z").format('LLLL'))
    return (
      <>
      <div className="transactions-container">
        <div>
          <h1>All Transactions</h1>
        </div>
        <div className="transactions-table-container">
          <table>
            <tbody>
              <tr>
                <th>Stock Symbol</th>
                <th>Transaction Amount</th>
                <th>Order Type</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
              {this.renderTransactionData()}
            </tbody>
          </table>
        </div>
      </div>
      </>
    )
  }
}

export default Transactions;