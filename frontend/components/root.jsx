import React from 'react';
import App from './app';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

const Root = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

export default Root;