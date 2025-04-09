import React, { useEffect, useState } from 'react';
import NavbarContainer from './navbar'
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Routes, Route, Outlet } from 'react-router-dom';
import SplashComponent from './splash';
import CreditCard from './static_pages/credit_card';
import Login from './login';
import Signup from './signup';
import Dashboard from './dashboard';
import StockShow from './stockShow';
import assetService from '../services/assetService';
import { UserProvider } from '../contexts/UserContext';

const MainLayout = () => {
  return (
    <>
      <NavbarContainer />
      <Outlet />
    </>
  );
};

const App = () => {
  const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load assets when the app initializes
    assetService.loadAssets()
      .then(() => setAssetsLoaded(true))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return <div>Error loading application assets: {error}</div>;
  }

  if (!assetsLoaded) {
    return <div>Loading application...</div>;
  }

  return (
    <UserProvider>
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
          <Route
            path='/stock/:ticker'
            element={
              <ProtectedRoute>
                <StockShow />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </UserProvider>
  )
}

export default App;