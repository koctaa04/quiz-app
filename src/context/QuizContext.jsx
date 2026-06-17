import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  getQuizResultCache, 
  saveQuizResultCache, 
  clearQuizResultCache, 
  clearQuestionsCache, 
  clearActiveQuizState 
} from '../utils/localStorage';

// Initialize context
const QuizContext = createContext(null);

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
    return getQuizResultCache();
  });
  const { user } = useAuth();

  // Automatically clear quiz session when user logs out
  useEffect(() => {
    if (!user) {
      clearQuestionsCache();
      clearQuizResultCache();
      const timer = setTimeout(() => {
        setQuestions([]);
        setScore(0);
        setTotalQuestions(0);
        setQuizResult(null);
        setError('');
        setLoading(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const updateScore = (newScore) => {
    setScore(newScore);
  };

  const updateQuizResult = (result) => {
    setQuizResult(result);
    if (result) {
      saveQuizResultCache(result);
    } else {
      clearQuizResultCache();
    }
  };

  // Prepares the app for a retake (retains same questions, resets score/progress)
  const resetQuiz = () => {
    setScore(0);
    setQuizResult(null);
    clearQuizResultCache();
    clearActiveQuizState(user);
  };

  // Clears all states and local cache upon sign out
  const clearQuizSession = () => {
    clearQuestionsCache();
    clearQuizResultCache();
    clearActiveQuizState(user);
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
