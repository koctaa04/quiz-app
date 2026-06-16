import { decodeHtmlEntities, shuffleArray } from '../utils/helpers';

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

export const triviaApi = {
  /**
   * Fetches 10 multiple-choice questions from the Open Trivia DB.
   * Cleans HTML entities and shuffles choices.
   * Handles network errors and HTTP status codes explicitly.
   * @returns {Promise<Array>} List of formatted questions
   */
  async fetchQuestions() {
    let response;
    try {
      response = await fetch(API_URL);
    } catch (netError) {
      console.error('[DevQuiz] Network connection error:', netError);
      throw new Error("Unable to connect to the quiz service.");
    }
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Quiz service is temporarily busy. Please try again in a few moments.");
      }
      if (response.status >= 500) {
        throw new Error("Server error occurred while loading questions.");
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('[DevQuiz] JSON parsing error:', jsonError);
      throw new Error("Invalid API Response");
    }

    if (!data || data.response_code === undefined || !Array.isArray(data.results)) {
      throw new Error("Invalid API Response");
    }

    if (data.response_code !== 0) {
      if (data.response_code === 5) {
        throw new Error("Quiz service is temporarily busy. Please try again in a few moments.");
      }
      throw new Error(`API returned response code: ${data.response_code}`);
    }

    return data.results.map((item) => {
      const decodedQuestion = decodeHtmlEntities(item.question);
      const decodedCorrectAnswer = decodeHtmlEntities(item.correct_answer);
      const decodedIncorrectAnswers = item.incorrect_answers.map(ans => decodeHtmlEntities(ans));
      
      // Combine correct answer and incorrect answers, then shuffle them
      const allOptions = shuffleArray([decodedCorrectAnswer, ...decodedIncorrectAnswers]);
      
      return {
        category: decodeHtmlEntities(item.category),
        question: decodedQuestion,
        options: allOptions,
        correct_answer: decodedCorrectAnswer
      };
    });
  }
};
