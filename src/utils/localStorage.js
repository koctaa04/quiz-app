/**
 * Utility functions for centralizing all localStorage interactions.
 * Decouples the application code and components from direct storage keys and format handling.
 */

// Keys used for localStorage to avoid typos and duplicate definitions
const KEYS = {
  USERNAME: 'quiz_username',
  QUESTIONS_CACHE: 'quiz_questions_cache',
  RESULT_CACHE: 'quiz_result_cache',
  ACTIVE_QUIZ_PREFIX: 'quiz_active_state_'
};

/**
 * Get the current logged-in username.
 * @returns {string} The username or an empty string.
 */
export function getStoredUsername() {
  return localStorage.getItem(KEYS.USERNAME) || '';
}

/**
 * Save the logged-in username.
 * @param {string} username 
 */
export function saveStoredUsername(username) {
  if (username) {
    localStorage.setItem(KEYS.USERNAME, username);
  }
}

/**
 * Clear the logged-in username.
 */
export function clearStoredUsername() {
  localStorage.removeItem(KEYS.USERNAME);
}

/**
 * Get cached trivia questions.
 * @returns {object|null} The parsed cache object or null.
 */
export function getQuestionsCache() {
  try {
    const cached = localStorage.getItem(KEYS.QUESTIONS_CACHE);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    console.error('[LocalStorageUtil] Error parsing questions cache:', e);
    return null;
  }
}

/**
 * Save trivia questions to cache.
 * @param {object} data - Cache object containing username, questions, and timestamp.
 */
export function saveQuestionsCache(data) {
  if (data) {
    localStorage.setItem(KEYS.QUESTIONS_CACHE, JSON.stringify(data));
  }
}

/**
 * Clear cached trivia questions.
 */
export function clearQuestionsCache() {
  localStorage.removeItem(KEYS.QUESTIONS_CACHE);
}

/**
 * Get cached quiz results.
 * @returns {object|null} The parsed result object or null.
 */
export function getQuizResultCache() {
  try {
    const cached = localStorage.getItem(KEYS.RESULT_CACHE);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    console.error('[LocalStorageUtil] Error parsing result cache:', e);
    return null;
  }
}

/**
 * Save quiz results to cache.
 * @param {object} result - The quiz performance results.
 */
export function saveQuizResultCache(result) {
  if (result) {
    localStorage.setItem(KEYS.RESULT_CACHE, JSON.stringify(result));
  }
}

/**
 * Clear cached quiz results.
 */
export function clearQuizResultCache() {
  localStorage.removeItem(KEYS.RESULT_CACHE);
}

/**
 * Get the active quiz state for a specific candidate.
 * Used for resuming an incomplete quiz.
 * @param {string} username - Candidate username.
 * @returns {object|null} The active quiz state or null if not found.
 */
export function getActiveQuizState(username) {
  if (!username) return null;
  try {
    const state = localStorage.getItem(`${KEYS.ACTIVE_QUIZ_PREFIX}${username}`);
    return state ? JSON.parse(state) : null;
  } catch (e) {
    console.error(`[LocalStorageUtil] Error parsing active quiz state for ${username}:`, e);
    return null;
  }
}

/**
 * Save the active quiz state for a specific candidate.
 * @param {string} username - Candidate username.
 * @param {object} state - Object containing questions, selectedAnswers, currentQuestionIndex, and timeLeft.
 */
export function saveActiveQuizState(username, state) {
  if (!username || !state) return;
  localStorage.setItem(`${KEYS.ACTIVE_QUIZ_PREFIX}${username}`, JSON.stringify(state));
}

/**
 * Clear the active quiz state for a specific candidate.
 * @param {string} username - Candidate username.
 */
export function clearActiveQuizState(username) {
  if (!username) return;
  localStorage.removeItem(`${KEYS.ACTIVE_QUIZ_PREFIX}${username}`);
}
