import React from 'react';
import NavbarContainer from './navbar'
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Routes, Route, Outlet } from 'react-router-dom';
import SplashComponent from './splash';
import CreditCard from './static_pages/credit_card';
import Login from './login';
import Signup from './signup';
import Dashboard from './dashboard';

const MainLayout = () => {
  return (
    <>
      <NavbarContainer />
      <Outlet />
    </>
  );
};

const App = () => (
  <Routes>
    {/* The login route is separate so it won't include the Navbar */}
    <Route
      path="/login"
      element={
        <AuthRoute>
          <Login />
        </AuthRoute>
      }
    />
    <Route
      path="/signup"
      element={
        <AuthRoute>
          <Signup />
        </AuthRoute>
      }
    />
    

    {/* All other routes use the MainLayout */}
    <Route element={<MainLayout />}>
      <Route
        path="/creditcard"
        element={
          <AuthRoute>
            <CreditCard />
          </AuthRoute>
        }
      />
      <Route
        path="/"
        element={
          <AuthRoute>
            <SplashComponent />
          </AuthRoute>
        }
      />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Route>
  </Routes>
);

export default App;