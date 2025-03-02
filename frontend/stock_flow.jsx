import React from 'react';
import { createRoot } from 'react-dom/client';
import { login, logout, signup } from './actions/session_actions';
import Root from './components/root';
import { fetchStocks, searchStock } from './actions/stock_actions';
import { fetchPrices } from './util/stock_api_util';
import { createTransaction } from './actions/session_actions';
import { addToWatchlist, deleteFromWatchlist } from './util/watchlist_api_util';
import store from './store';


document.addEventListener("DOMContentLoaded", () => {
  Object.assign(window, window.Stockflow);
  let initialState = {};

  // If there's a currentUser in the window, use it to preload state
  if (window.currentUser) {
    console.log("current user found:", window.currentUser)
    let currentUser = window.currentUser.user
    initialState = {
      entities: {
        users: { [currentUser.id]: currentUser }
      },
      session: { id: currentUser.id }
    };
    delete window.currentUser;
  }
    
  // Locate the root element and mount the React application
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<Root store={store(initialState)} />);
  } else {
    console.error("Root element not found!");
  }
});


export {
  login,
  logout,
  signup,
  fetchPrices,
  fetchStocks,
  searchStock,
  createTransaction,
  addToWatchlist,
  deleteFromWatchlist
}
