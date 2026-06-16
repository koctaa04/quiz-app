import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Initialize context
const QuizContext = createContext(null);

const CACHE_KEY = 'quiz_questions_cache';

/**
 * QuizProvider provides state management for the user profile, active session, and final score.
 */
export function QuizProvider({ children }) {
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Automatically clear quiz session when user logs out
  useEffect(() => {
    if (!user) {
      localStorage.removeItem(CACHE_KEY);
      setQuestions([]);
      setScore(0);
      setTotalQuestions(0);
      setError('');
      setLoading(true);
    }
  }, [user]);

  const updateScore = (newScore) => {
    setScore(newScore);
  };

  // Prepares the app for a retake (retains same questions, resets score/progress)
  const resetQuiz = () => {
    setScore(0);
  };

  // Clears all states and local cache upon sign out
  const clearQuizSession = () => {
    localStorage.removeItem(CACHE_KEY);
    setQuestions([]);
    setScore(0);
    setTotalQuestions(0);
    setError('');
    setLoading(true);
  };

  return (
    <QuizContext.Provider
      value={{
        score,
        totalQuestions,
        questions,
        loading,
        error,
        setScore,
        setTotalQuestions,
        setQuestions,
        setLoading,
        setError,
        updateScore,
        resetQuiz,
        clearQuizSession
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
