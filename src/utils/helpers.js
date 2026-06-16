/**
 * Helper utility functions for the Quiz Application.
 */

/**
 * Formats a count of seconds into MM:SS format.
 * Useful for rendering quiz countdown timers.
 * @param {number} totalSeconds 
 * @returns {string}
 */
export function formatTime(totalSeconds) {
  if (totalSeconds < 0) return '00:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  
  return `${paddedMinutes}:${paddedSeconds}`;
}

/**
 * Shuffles the items of an array using Fisher-Yates algorithm.
 * Useful for randomizing quiz answers.
 * @param {Array} array 
 * @returns {Array} Shuffled copy
 */
export function shuffleArray(array) {
  const arrCopy = [...array];
  for (let i = arrCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
  }
  return arrCopy;
}

/**
 * Computes percentage scores.
 * @param {number} score 
 * @param {number} total 
 * @returns {number}
 */
export function calculatePercentage(score, total) {
  if (!total) return 0;
  return Math.round((score / total) * 100);
}

/**
 * Decodes HTML entities in a string.
 * Uses the browser's DOMParser to safely convert entities like &quot;, &#039;, &amp;, etc.
 * @param {string} text 
 * @returns {string} Decoded string
 */
export function decodeHtmlEntities(text) {
  if (!text) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  return doc.documentElement.textContent;
}

