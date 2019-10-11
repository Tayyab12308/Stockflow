import { connect } from 'react-redux';
import { fetchBatchRequest } from '../../util/stock_api_util';
import Watchlist from './watchlist'

const msp = state => {
  let watchlist = Object.values(state.entities.users)[0].watchlist
  return { watchlist }
}

const mdp = dispatch => {
  return {
    fetchBatchRequest: stockArr => fetchBatchRequest(stockArr),
  }
}

export default connect(msp, mdp)(Watchlist)