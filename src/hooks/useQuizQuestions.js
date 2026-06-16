import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import { triviaApi } from '../services/triviaApi';

const CACHE_KEY = 'quiz_questions_cache';
const CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Custom hook to manage fetching trivia questions synchronized with QuizContext.
 * Implements candidate-specific caching in localStorage, React Strict Mode fetch protection,
 * and retrying.
 * 
 * @returns {object} { questions, loading, error, retry }
 */
export function useQuizQuestions() {
  const { user } = useAuth();
  const { 
    questions, 
    loading, 
    error, 
    setQuestions, 
    setLoading, 
    setError, 
    setTotalQuestions 
  } = useQuiz();

  // useRef persists across mounts in Strict Mode development double-invocation
  const fetchInitiated = useRef(false);

  const loadQuestions = useCallback(async (forceFetch = false) => {
    if (!user) return;

    // 1. Caching layer (check unless user explicitly requested a fresh retry)
    if (!forceFetch) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { username, questions: cachedQuestions, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;

          // Ensure the cached questions belong to the currently logged in candidate
          if (username === user) {
            if (age < CACHE_EXPIRY_MS) {
              console.log(`[DevQuiz] Cache hit: Using cached questions for candidate: ${user}`);
              setQuestions(cachedQuestions);
              setTotalQuestions(cachedQuestions.length);
              setLoading(false);
              setError('');
              return;
            } else {
              console.log('[DevQuiz] Cache expired.');
            }
          } else {
            console.log(`[DevQuiz] Stale cache belongs to a different candidate (${username}). Ignoring cache.`);
          }
        } catch (e) {
          console.warn('[DevQuiz] Cache parsing failed, clearing corrupted data.');
          localStorage.removeItem(CACHE_KEY);
        }
      }
    }

    // 2. React Strict Mode fetch duplication prevention
    if (fetchInitiated.current && !forceFetch) {
      console.log('[DevQuiz] Fetch already in progress, skipping duplicate call.');
      return;
    }

    fetchInitiated.current = true;
    console.log('[DevQuiz] Fetching new questions from API...');

    setLoading(true);
    setError('');

    try {
      const data = await triviaApi.fetchQuestions();
      setQuestions(data);
      setTotalQuestions(data.length);

      // Save candidate-specific data to localStorage cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        username: user,
        questions: data,
        timestamp: Date.now()
      }));

      setLoading(false);
    } catch (err) {
      console.log(`[DevQuiz] Error fetching questions: ${err.message}`);
      setError(err.message || 'An error occurred while loading questions.');
      setLoading(false);
    }
  }, [user, setQuestions, setLoading, setError, setTotalQuestions]);

  // Manual retry handler
  const retry = useCallback(() => {
    console.log('[DevQuiz] Retry triggered. Invalidating cache and resetting context questions.');
    localStorage.removeItem(CACHE_KEY);
    setQuestions([]);
    fetchInitiated.current = false;
    loadQuestions(true);
  }, [loadQuestions, setQuestions]);

  // Fetch questions on mount
  useEffect(() => {
    // If questions are already loaded in memory, don't run loadQuestions on mount (important for Retake Quiz)
    if (questions && questions.length > 0) {
      console.log('[DevQuiz] Questions already exist in memory. Skipping mount fetch.');
      setLoading(false);
      setError('');
      return;
    }
    loadQuestions();
  }, [loadQuestions, questions, setLoading, setError]);

  return { questions, loading, error, retry };
}
