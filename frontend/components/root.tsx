import React from 'react';
import App from './app';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Store } from 'redux';
import { RootState } from '../reducers/root_reducer';

interface RootProps {
  store: Store<RootState>; // Store type with RootState
}

const Root: React.FC<RootProps> = ({ store }: RootProps): React.JSX.Element => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

export default Root;