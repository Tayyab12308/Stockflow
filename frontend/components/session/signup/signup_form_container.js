import { connect } from 'react-redux';
import { signup, clearSessionErrors } from '../../../actions/session_actions';
import SignupForm from './signup_form';

const msp = ({ errors }) => {
  return { errors: errors.session };
};

const mdp = dispatch => {
  return {
    signup: user => dispatch(signup(user)),
    clearErrors: () => dispatch(clearSessionErrors())
  };
};

export default connect(msp, mdp)(SignupForm);