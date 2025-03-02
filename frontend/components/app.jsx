import React from 'react';
import NavbarContainer from './navbar'
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Routes, Route } from 'react-router-dom';
import SplashComponent from './splash';
import CreditCard from './static_pages/credit_card';


const App = () => (
  <div>
    <NavbarContainer />
    <Routes>
      <Route path="/creditcard" element={
        <AuthRoute>
          <CreditCard />
        </AuthRoute>
      } />
      <Route path="/" element={
        <AuthRoute>
          <SplashComponent />
        </AuthRoute>
      } />
    </Routes>
  </div>
);

export default App;