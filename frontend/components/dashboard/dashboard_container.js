import { connect } from 'react-redux';
import Dashboard from './dashboard';
import { fetchPrices, fetchAllNews } from '../../util/stock_api_util';

const msp = state => {
  let portfolio = state.entities.users
  return { portfolio }
};

const mdp = dispatch => {
  return {
    fetchAllNews: () => fetchAllNews(),
    // fetchPrices: stock => fetchPrices(stock)
  }
}

export default connect(msp, mdp)(Dashboard);