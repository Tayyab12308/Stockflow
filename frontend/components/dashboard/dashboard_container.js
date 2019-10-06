import { connect } from 'react-redux';
import { fetchStocks } from '../../actions/stock_actions';
import Dashboard from './dashboard';

const msp = state => {
  let stock = Object.values(state.entities.stock)
  // debugger
  // let stock = state.entities.stock
  return { stock }
};

const mdp = dispatch => {
  return {
    fetchStocks: stock => dispatch(fetchStocks(stock)),
  }
}

export default connect(msp, mdp)(Dashboard);