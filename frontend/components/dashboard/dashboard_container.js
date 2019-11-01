import { connect } from 'react-redux';
import Dashboard from './dashboard';
import { fetchBatchRequest, fetchAllNews } from '../../util/stock_api_util';


const msp = state => {
  let portfolio = state.entities.users
  return { portfolio }
};

const mdp = dispatch => {
  return {
    fetchAllNews: () => fetchAllNews(),
    fetchBatchRequest: stockArr => fetchBatchRequest(stockArr),
  }
}

export default connect(msp, mdp)(Dashboard);