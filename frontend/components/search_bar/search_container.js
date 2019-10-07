import { connect} from 'react-redux';
import Search from './search';
import { searchStock} from '../../actions/stock_actions';

const msp = state => {
  let results = state.entities.search
  return { results }
};

const mdp = dispatch => {
  return {
    searchStock: string => dispatch(searchStock(string))
  }
};

export default connect(msp, mdp)(Search);
