import React from 'react';
import ReactDOM from 'react-dom';
import { login, logout, signup } from './actions/session_actions';
import configureStore from './store/store';
import Root from './components/root';
import { fetchStocks, searchStock } from './actions/stock_actions';
import { fetchPrices } from './util/stock_api_util'

document.addEventListener("DOMContentLoaded", () => {
  let store;
  if (window.currentUser) {
    const preloadedState = {
      entities: {
        users: { [window.currentUser.id]: window.currentUser }
      },
      session: { id: window.currentUser.id }
    };
    // document.body.style.backgroundColor = "#1b1b1d";
    // document.body.style.color = "white";
    store = configureStore(preloadedState);    
    delete window.currentUser;
  } else {
    store = configureStore();
    // document.body.style.backgroundColor = "white"
  }
  // TEST //
  window.store = store;
  window.getState = store.getState;
  window.dispatch = store.dispatch;
  window.logout = logout;
  window.login = login;
  window.signup = signup;
  window.fetchPrices = fetchPrices;
  window.fetchStocks = fetchStocks;
  window.searchStock = searchStock;
  // TEST //
    
  const root = document.getElementById("root");
  ReactDOM.render(<Root store={store}/>, root);
});