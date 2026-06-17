import { createContext, useContext, useState } from 'react';
import { getStoredUsername, saveStoredUsername, clearStoredUsername } from '../utils/localStorage';

// Create AuthContext
const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the app and manages user authentication state.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Check localStorage utility to keep user logged in on page refresh
    return getStoredUsername();
  });

  const login = (username) => {
    setUser(username);
    saveStoredUsername(username);
  };

  const logout = () => {
    setUser('');
    clearStoredUsername();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to easily consume the AuthContext in any child component.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
