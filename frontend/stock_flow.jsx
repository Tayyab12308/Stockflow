import React from 'react';
import { createRoot } from 'react-dom/client';
import { login, logout, signup } from './actions/session_actions';
import configureStore from './store/store';
import Root from './components/root';
import { fetchStocks, searchStock } from './actions/stock_actions';
import { fetchPrices } from './util/stock_api_util';
import { createTransaction } from './actions/session_actions';
import { addToWatchlist, deleteFromWatchlist } from './util/watchlist_api_util';

document.addEventListener("DOMContentLoaded", () => {
  let store;

  // If there's a currentUser in the window, use it to preload state
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

  /** TEST - Expose store and actions for debugging if needed */ 
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
  window.addToWatchlist = addToWatchlist;
  window.deleteFromWatchlist = deleteFromWatchlist;
  /** END TEST BLOCK */
    
  // Locate the root element and mount the React application
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<Root store={store} />);
  } else {
    console.error("Root element not found!");
  }
});