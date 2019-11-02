import { connect } from 'react-redux';
import { fetchBatchRequest } from '../../util/stock_api_util';
import Watchlist from './watchlist'

const msp = state => {
  let watchlist = Object.values(state.entities.users)[0].watchlist;
  let currentlyInvested = Object.values(state.entities.users)[0].total_stock_count;
  return { watchlist, currentlyInvested }
}

const mdp = dispatch => {
  return {
    fetchBatchRequest: stockArr => fetchBatchRequest(stockArr),
  }
}

export default connect(msp, mdp)(Watchlist)