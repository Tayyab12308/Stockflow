import { connect } from 'react-redux';
import { login } from '../../actions/session_actions';
import LoginForm from './login_form'

const msp = ({ errors }) => {
  debugger
  return { errors: errors.session };
};

const mdp = dispatch => {
  return {
    login: user => dispatch(login(user)),
    demoUser: ({email_address: "", password: ""})
  };
};

export default connect(msp, mdp)(LoginForm);