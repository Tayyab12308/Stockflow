import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../reducers/root_reducer';

interface RouteProps {
  children: JSX.Element;
}

// AuthRoute: Redirects to dashboard if logged in
export const AuthRoute: React.FC<RouteProps> = ({ children }) => {
  const loggedIn = useSelector((state: RootState) => Boolean(state.session.id));
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [loggedIn, navigate]);

  return !loggedIn ? children : null;
};

// ProtectedRoute: Redirects to login if not logged in
export const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const loggedIn = useSelector((state: RootState) => Boolean(state.session.id));
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login', { replace: true });
    }
  }, [loggedIn, navigate]);

  return loggedIn ? children : null;
};
