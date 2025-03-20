import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './components/root';
import { createStore } from './store';
import { RootState } from './reducers/root_reducer';


document.addEventListener("DOMContentLoaded", () => {
  Object.assign(window, window.Stockflow);
  let initialState: RootState = {
    entities: {
      users: {},
    },
    session: {
      id: null,
    },
    errors: {
      session: [],
    }
  };

  // If there's a currentUser in the window, use it to preload state
  if (window.currentUser) {
    console.log("current user found:", window.currentUser)
    const currentUser = window.currentUser.user
    initialState = {
      ...initialState,
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
    root.render(
        <Root store={createStore(initialState)} />
    );
  } else {
    console.error("Root element not found!");
  }
});
