import Transactions from './transactions';
import { connect } from 'react-redux';

const msp = (state) => {
  debugger
  let transactions = Object.values(state.entities.users)[0].transactions
  return { transactions }
}

export default connect(msp, null)(Transactions);