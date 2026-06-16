import React, { createContext, useContext, useState, useEffect } from 'react';

// Initialize context
const QuizContext = createContext(null);

/**
 * QuizProvider provides state management for the user profile, active session, and final score.
 */
export function QuizProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Proactively restore from localStorage to survive page reloads
    return localStorage.getItem('quiz_username') || '';
  });
  const [score, setScore] = useState(0);

  // Sync username changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('quiz_username', user);
    } else {
      localStorage.removeItem('quiz_username');
    }
  }, [user]);

  const login = (username) => {
    setUser(username);
  };

  const logout = () => {
    setUser('');
    setScore(0);
    localStorage.removeItem('quiz_username');
  };

  const updateScore = (newScore) => {
    setScore(newScore);
  };

  const resetQuiz = () => {
    setScore(0);
  };

  return (
    <QuizContext.Provider
      value={{
        user,
        score,
        login,
        logout,
        updateScore,
        resetQuiz
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

/**
 * Custom hook to consume the QuizContext easily in components.
 */
export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
