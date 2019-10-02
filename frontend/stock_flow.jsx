import React from 'react';
import ReactDOM from 'react-dom';
import { login, logout, signup } from './actions/session_actions';
import configureStore from './store/store';
import Root from './components/root'

document.addEventListener("DOMContentLoaded", () => {
  const store = configureStore();
  // TEST //
  window.store = store;
  window.getState = store.getState;
  window.dispatch = store.dispatch;
  window.logout = logout;
  window.login = login;
  window.signup = signup;
  // TEST //
  const root = document.getElementById("root");
  ReactDOM.render(<Root store={store}/>, root);
});