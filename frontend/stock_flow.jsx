import React from 'react';
import ReactDOM from 'react-dom';
import { login, logout, signup } from './util/session_api_util';
import Root from './components/root'

document.addEventListener("DOMContentLoaded", () => {

  // TEST //
  window.logout = logout;
  window.login = login;
  window.signup = signup;
  // TEST //
  const root = document.getElementById("root");
  ReactDOM.render(<Root />, root);
});