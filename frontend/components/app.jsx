import React from 'react';
import NavbarContainer from './navbar/navbar'
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Routes, Route } from 'react-router-dom';
import SignUpForm from '../components/session/signup/signup_form';
import LoginForm from '../components/session/login_form';
import SplashComponent from './splash';
import Dashboard from './dashboard/dashboard';
import StockShow from './stock_show/stock_show';
import Transactions from './transactions/transactions';


const App = () => (
  <div>
    <NavbarContainer />
    <Routes>
      <Route path="/signup" element={
        <AuthRoute>
          <SignUpForm />
        </AuthRoute>
      } />
      <Route path="/login" element={
        <AuthRoute>
          <LoginForm />
        </AuthRoute>
      } />
      <Route path="/" element={
        <AuthRoute>
          <SplashComponent />
        </AuthRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/stock/:ticker" element={
        <ProtectedRoute>
          <StockShow />
        </ProtectedRoute>
      } />
      <Route path="/transactions" element={
        <ProtectedRoute>
          <Transactions />
        </ProtectedRoute>
      } />
    </Routes>
  </div>
);

export default App;