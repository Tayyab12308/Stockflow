import { connect } from 'react-redux';
import { fetchStocks } from '../../actions/stock_actions';
import StockShow from './stock_show';

const msp = (state, ownProps) => {
  let searchString = ownProps.match.url.split("/")[2]
  let stock = Object.values(state.entities.stock)
  return { stock, searchString }
};

const mdp = dispatch => {
  return {
    fetchStocks: stock => dispatch(fetchStocks(stock)),
  }
}

export default connect(msp, mdp)(StockShow);