import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Root from './components/root';
import { createStore } from './store';
import { RootState } from './reducers/root_reducer';
import userService from './services/userService';

document.addEventListener("DOMContentLoaded", async () => {
  Object.assign(window, window.Stockflow);
  
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found!");
    return;
  }
  
  // Create a loader component that will handle the initial state setup
  const AppLoader = () => {
    const [store, setStore] = useState<ReturnType<typeof createStore> | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const initializeApp = async () => {
        let initialState: RootState = {
          entities: {
            users: {},
          },
          session: {
            id: null,
          },
          errors: {
            session: [],
          },
          ui: {
            darkTheme: false
          }
        };

        try {
          // First try to get user from window for backward compatibility
          let currentUser = window.currentUser?.user;
          
          // If not in window, fetch from API
          if (!currentUser) {
            currentUser = await userService.getCurrentUser();
          } else {
            // Clean up window object
            delete window.currentUser;
          }
          
          // If we have a user from either source, update initial state
          if (currentUser) {
            initialState = {
              ...initialState,
              entities: {
                users: { [currentUser.id]: currentUser }
              },
              session: { id: currentUser.id },
              ui: {
                darkTheme: true,
              }
            };

          }
        } catch (error) {
          console.error("Error loading user:", error);
        } finally {
          // Create the store with our initial state
          setStore(createStore(initialState));
          setLoading(false);
        }
      };
      
      initializeApp();
    }, []);
    
    if (loading || !store) {
      return <div className="app-loading">Loading StockFlow...</div>;
    }
    
    return <Root store={store} />;
  };
  
  // Render the loader
  const root = createRoot(rootElement);
  root.render(<AppLoader />);
});