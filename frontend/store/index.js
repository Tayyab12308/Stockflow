import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/root_reducer';
import logger from 'redux-logger';

const store = (preloadedState = {}) => configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  preloadedState
});

export default store;
