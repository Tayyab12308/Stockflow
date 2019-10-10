import { connect } from 'react-redux';
import { fetchStocks } from '../../actions/stock_actions';
import { fetchCompany, fetchKeyStats, fetchNews } from '../../util/stock_api_util';
import StockShow from './stock_show';

const msp = (state, ownProps) => {
  let ticker = ownProps.match.params.ticker
  let stock = Object.values(state.entities.stock)
  let user = Object.values(state.entities.users)[0]
  return { stock, ticker, user }
};

const mdp = dispatch => {
  return {
    fetchStocks: stock => dispatch(fetchStocks(stock)),
    fetchCompany: symbol => fetchCompany(symbol),
    fetchKeyStats: symbol => fetchKeyStats(symbol),
    fetchNews: symbol => fetchNews(symbol),
  }
}

export default connect(msp, mdp)(StockShow);