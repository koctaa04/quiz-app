import React, { createContext, useContext, useState } from 'react';

// Create AuthContext
const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the app and manages user authentication state.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Check localStorage to keep user logged in on page refresh
    return localStorage.getItem('quiz_username') || '';
  });

  const login = (username) => {
    setUser(username);
    localStorage.setItem('quiz_username', username);
  };

  const logout = () => {
    setUser('');
    localStorage.removeItem('quiz_username');
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
