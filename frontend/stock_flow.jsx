import React from 'react';
import ReactDOM from 'react-dom';
import { login, logout, signup } from './actions/session_actions';
import configureStore from './store/store';
import Root from './components/root';
import { fetchStocks, searchStock } from './actions/stock_actions';
import { fetchPrices, fetchBatchRequest } from './util/stock_api_util';
import { createTransaction } from './actions/session_actions';
import { addToWatchlist, deleteFromWatchlist } from './util/watchlist_api_util';

document.addEventListener("DOMContentLoaded", () => {
  let store;
  if (window.currentUser) {
    let currentUser = window.currentUser.user
    const preloadedState = {
      entities: {
        users: { [currentUser.id]: currentUser }
      },
      session: { id: currentUser.id }
    };
    store = configureStore(preloadedState);    
    delete window.currentUser;
  } else {
    store = configureStore();
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
  window.createTransaction = createTransaction;
  window.fetchBatchRequest = fetchBatchRequest;
  window.addToWatchlist = addToWatchlist;
  window.deleteFromWatchlist = deleteFromWatchlist;
  // TEST //
    
  const root = document.getElementById("root");
  ReactDOM.render(<Root store={store}/>, root);
});