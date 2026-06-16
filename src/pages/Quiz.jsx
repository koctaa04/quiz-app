import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useQuiz } from '../context/QuizContext';

/**
 * Quiz view shell. Displays placeholder quiz question and handles navigation to results.
 */
export default function Quiz() {
  const { user, logout } = useQuiz();
  const navigate = useNavigate();

  // If no user is logged in, redirect or prompt
  if (!user) {
    return (
      <div className="container animate-fade-in" style={{ justifyContent: 'center' }}>
        <Card
          title="Access Denied"
          subtitle="You need to sign in before taking the quiz."
          style={{ maxWidth: '400px', textAlign: 'center' }}
        >
          <Button onClick={() => navigate('/login')} variant="primary" style={{ marginTop: '1rem' }}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div style={{ width: '100%', maxWidth: '650px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <span className="badge badge-primary">Active Candidate</span>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-inverse)' }}>Candidate: {user}</h3>
        </div>
        <Button onClick={() => { logout(); navigate('/login'); }} variant="secondary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
          Quit Quiz
        </Button>
      </div>

      <Card
        title="Question 1 of 5"
        subtitle="Sample Category: Frontend Basics"
        glow={true}
        style={{ maxWidth: '650px', width: '100%' }}
      >
        <div style={{ margin: '1.5rem 0' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-inverse)', fontWeight: '500', marginBottom: '1.5rem' }}>
            Which hook would you use to store a memoized value across component re-renders in React?
          </p>

          {/* Options styling is pre-planned to be fully responsive list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={optionStyle}>
              <input type="radio" name="options" value="a" style={radioStyle} defaultChecked />
              <span>useCallback</span>
            </label>
            <label style={optionStyle}>
              <input type="radio" name="options" value="b" style={radioStyle} />
              <span>useMemo</span>
            </label>
            <label style={optionStyle}>
              <input type="radio" name="options" value="c" style={radioStyle} />
              <span>useRef</span>
            </label>
            <label style={optionStyle}>
              <input type="radio" name="options" value="d" style={radioStyle} />
              <span>useState</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <Button variant="secondary" disabled style={{ width: '48%' }}>
            Previous
          </Button>
          <Button onClick={() => navigate('/result')} variant="primary" style={{ width: '48%' }}>
            Finish Quiz & View Results
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Inline styles for high-quality mock options list (will be moved to general stylesheet or page specific)
const optionStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '1rem',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
  gap: '1rem',
  userSelect: 'none'
};

const radioStyle = {
  accentColor: 'var(--primary)',
  width: '18px',
  height: '18px',
  cursor: 'pointer'
};
