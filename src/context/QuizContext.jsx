import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Initialize context
const QuizContext = createContext(null);

/**
 * QuizProvider provides state management for the user profile, active session, and final score.
 */
export function QuizProvider({ children }) {
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const { user } = useAuth();

  // Automatically reset score when user logs out
  useEffect(() => {
    if (!user) {
      setScore(0);
      setTotalQuestions(10);
    }
  }, [user]);

  const updateScore = (newScore) => {
    setScore(newScore);
  };

  const resetQuiz = () => {
    setScore(0);
  };

  return (
    <QuizContext.Provider
      value={{
        score,
        totalQuestions,
        updateScore,
        setTotalQuestions,
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
