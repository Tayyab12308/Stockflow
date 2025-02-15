import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// AuthRoute: Renders children if the user is not logged in; otherwise redirects to dashboard.
export const AuthRoute = ({ children }) => {
  const loggedIn = useSelector(state => Boolean(state.session.id));
  return !loggedIn ? children : <Navigate to="/dashboard" replace />;
};

// ProtectedRoute: Renders children if the user is logged in; otherwise redirects to login.
export const ProtectedRoute = ({ children }) => {
  const loggedIn = useSelector(state => Boolean(state.session.id));
  return loggedIn ? children : <Navigate to="/login" replace />;
};
