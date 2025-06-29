import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the user type
interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  userType: 'recruiter' | 'candidate' | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserType: (userType: 'recruiter' | 'candidate') => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  checkAuth: async () => {},
  logout: async () => {},
  updateUserType: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/current', {
        method: 'GET',
        credentials: 'include', // Important for cookies
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Update user type (recruiter/candidate)
  const updateUserType = async (userType: 'recruiter' | 'candidate') => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/user-type', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to update user type:', error);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Context value
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    checkAuth,
    logout,
    updateUserType,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
