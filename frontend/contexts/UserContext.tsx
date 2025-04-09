// app/frontend/contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import userService from '../services/userService';
import { User } from '../interfaces'; // Import the User type
import { logoutUser } from '../actions/session_actions';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchUser = async () => {
    setLoading(true);
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      setError('Failed to load user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if we already have bootstrap data
    const bootstrapUser = (window as any).currentUser;
    if (bootstrapUser) {
      // Use the bootstrap data initially, then remove it
      setUser(bootstrapUser);
      setLoading(false);
      delete (window as any).currentUser;
    } else {
      // Fetch from API if no bootstrap data
      fetchUser();
    }
  }, []);

  const refreshUser = async () => {
    userService.clearCurrentUser();
    await fetchUser();
  };

  const logout = () => {
    // Call your logout endpoint here if needed
    setUser(null);
    dispatch(logoutUser());
    userService.clearCurrentUser();
  };

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};