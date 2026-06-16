import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import Login from './pages/Login';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import { useQuiz } from './context/QuizContext';

/**
 * Navigation Bar Component shown at the top of every view.
 */
function Header() {
  const { user } = useQuiz();

  return (
    <header className="app-header">
      <div className="nav-container">
        <div className="logo-container">
          <svg
            className="logo-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="logo-text">DevQuiz Challenge</span>
        </div>

        <nav className="nav-links">
          <NavLink 
            to="/login" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Login
          </NavLink>
          <NavLink 
            to="/quiz" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Quiz
          </NavLink>
          <NavLink 
            to="/result" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Result
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

/**
 * Footer Component shown at the bottom of the page.
 */
function Footer() {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} DevQuiz.</p>
    </footer>
  );
}

/**
 * Core Application Router Config.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Defined routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
