import { configureStore } from "@reduxjs/toolkit";
import rootReducer, { RootState } from "../reducers/root_reducer";
import logger from "redux-logger";

import { createLogger, ReduxLoggerOptions } from 'redux-logger';

const loggerOptions: ReduxLoggerOptions = {
  // Only log actions that are plain objects.
  predicate: (_getState, action) => typeof action === 'object' && action !== null,
  // you can add other options like collapsed, duration, etc.
};

const loggerMiddleware = createLogger(loggerOptions);

export const createStore = (
  preloadedState?: RootState
) => configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
  preloadedState: preloadedState as RootState | undefined,
});

const store = createStore();

export type AppDispatch = typeof store.dispatch;
export default store;
