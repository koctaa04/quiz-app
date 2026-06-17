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
  const [quizResult, setQuizResult] = useState(() => {
    try {
      const saved = localStorage.getItem('quiz_result_cache');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('[QuizContext] Error parsing cached quiz result:', e);
      return null;
    }
  });
  const { user } = useAuth();

  // Automatically clear quiz session when user logs out
  useEffect(() => {
    if (!user) {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem('quiz_result_cache');
      setQuestions([]);
      setScore(0);
      setTotalQuestions(0);
      setQuizResult(null);
      setError('');
      setLoading(true);
    }
  }, [user]);

  const updateScore = (newScore) => {
    setScore(newScore);
  };

  const updateQuizResult = (result) => {
    setQuizResult(result);
    if (result) {
      localStorage.setItem('quiz_result_cache', JSON.stringify(result));
    } else {
      localStorage.removeItem('quiz_result_cache');
    }
  };

  // Prepares the app for a retake (retains same questions, resets score/progress)
  const resetQuiz = () => {
    setScore(0);
    setQuizResult(null);
    localStorage.removeItem('quiz_result_cache');
  };

  // Clears all states and local cache upon sign out
  const clearQuizSession = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem('quiz_result_cache');
    setQuestions([]);
    setScore(0);
    setTotalQuestions(0);
    setQuizResult(null);
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
        quizResult,
        setScore,
        setTotalQuestions,
        setQuestions,
        setLoading,
        setError,
        updateScore,
        updateQuizResult,
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
