/**
 * Service to handle API calls (e.g. fetching questions, submitting results).
 * Mock implementation uses simulated network delay.
 */

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "Which hook would you use to store a memoized value across component re-renders in React?",
    options: ["useCallback", "useMemo", "useRef", "useState"],
    answer: "useMemo",
    category: "React Hooks"
  },
  {
    id: 2,
    question: "What is the primary function of Vite in a React application setup?",
    options: [
      "Global State Management", 
      "Routing & Navigation", 
      "Development Server and Bundler", 
      "Database Connector"
    ],
    answer: "Development Server and Bundler",
    category: "Tooling"
  },
  {
    id: 3,
    question: "In React Router DOM, which component is used to render nested routes inside a layout?",
    options: ["<Link />", "<Outlet />", "<Routes />", "<Navigate />"],
    answer: "<Outlet />",
    category: "React Router"
  }
];

export const quizApi = {
  /**
   * Fetches list of quiz questions with simulated delay.
   */
  async getQuestions() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_QUESTIONS);
      }, 800); // 800ms network delay simulation
    });
  },

  /**
   * Submits quiz score to server.
   */
  async submitScore(username, score) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Score of ${score} saved for ${username}` });
      }, 500);
    });
  }
};
