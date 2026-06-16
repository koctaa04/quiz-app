import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import { triviaApi } from '../services/triviaApi';

const CACHE_KEY = 'quiz_questions_cache';
const CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Custom hook to manage fetching trivia questions.
 * Implements client-side caching in localStorage, React Strict Mode fetch protection,
 * robust error state management, and manual retries.
 * 
 * @returns {object} { questions, loading, error, retry }
 */
export function useQuizQuestions() {
  const { user } = useAuth();
  const { setTotalQuestions } = useQuiz();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useRef persists across mounts in Strict Mode development double-invocation
  const fetchInitiated = useRef(false);

  const loadQuestions = useCallback(async (forceFetch = false) => {
    if (!user) return;

    // 1. Caching layer (check unless user explicitly requested a fresh retry)
    if (!forceFetch) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { questions: cachedQuestions, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;

          if (age < CACHE_EXPIRY_MS) {
            console.log('[DevQuiz] Cache hit: Using cached questions.');
            setQuestions(cachedQuestions);
            setTotalQuestions(cachedQuestions.length);
            setLoading(false);
            setError('');
            return;
          } else {
            console.log('[DevQuiz] Cache expired.');
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

      // Save valid data to localStorage cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        questions: data,
        timestamp: Date.now()
      }));

      setLoading(false);
    } catch (err) {
      console.log(`[DevQuiz] Error fetching questions: ${err.message}`);
      setError(err.message || 'An error occurred while loading questions.');
      setLoading(false);
    }
  }, [user, setTotalQuestions]);

  // Manual retry handler
  const retry = useCallback(() => {
    console.log('[DevQuiz] Retry triggered. Invalidating cache and resetting refs.');
    localStorage.removeItem(CACHE_KEY);
    fetchInitiated.current = false;
    loadQuestions(true);
  }, [loadQuestions]);

  // Fetch questions on mount (triggers once unless dependency updates)
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  return { questions, loading, error, retry };
}
