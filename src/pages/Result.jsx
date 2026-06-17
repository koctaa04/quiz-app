import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { calculatePercentage } from '../utils/helpers';

/**
 * Result view. Displays candidate performance and choices to retake or sign out.
 */
export default function Result() {
  const { user, logout } = useAuth();
  const { score, totalQuestions, resetQuiz, clearQuizSession } = useQuiz();
  const navigate = useNavigate();
  const location = useLocation();
  const timeOut = location.state?.timeOut || false;

  // If no user is logged in, redirect or prompt
  if (!user) {
    return (
      <div className="container animate-fade-in" style={{ justifyContent: 'center' }}>
        <Card
          title="No Results Found"
          subtitle="You need to sign in and take a quiz before viewing results."
          style={{ maxWidth: '400px', textAlign: 'center' }}
        >
          <Button onClick={() => navigate('/login')} variant="primary" style={{ marginTop: '1rem' }}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  // Calculate generic score display dynamically
  const percentage = calculatePercentage(score, totalQuestions);
  const passed = percentage >= 60;

  return (
    <div className="container animate-fade-in" style={{ justifyContent: 'center' }}>
      <Card
        title="Challenge Complete!"
        subtitle="Here is your performance summary."
        glow={true}
        style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}
      >
        {timeOut && (
          <div 
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              color: 'var(--error)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginTop: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Time's up! Answers submitted automatically.
          </div>
        )}
        <div style={{ margin: '2rem 0' }}>
          {passed ? (
            <span className="badge badge-success">Passed</span>
          ) : (
            <span 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem',
                background: 'var(--error-glow)',
                color: 'var(--error)',
                border: '1px solid rgba(244, 63, 94, 0.3)'
              }}
            >
              Failed
            </span>
          )}
          
          <div style={{ margin: '1.5rem 0' }}>
            <h1 className="gradient-text" style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: 1 }}>
              {percentage}%
            </h1>
            <p style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>
              {passed ? (
                <>Well done, <strong>{user}</strong>!</>
              ) : (
                <>Keep practicing, <strong>{user}</strong>!</>
              )}
            </p>
          </div>

          <div style={statBoxStyle}>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>Score</span>
              <span style={statValStyle}>{score} / {totalQuestions}</span>
            </div>
            <div style={{ width: '1px', background: 'var(--border)', height: '40px' }}></div>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>Accuracy</span>
              <span style={statValStyle}>{percentage}%</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Button 
            onClick={() => {
              resetQuiz();
              navigate('/quiz');
            }} 
            variant="primary"
          >
            Retake Challenge
          </Button>
          
          <Button 
            onClick={() => {
              clearQuizSession();
              logout();
              navigate('/login');
            }} 
            variant="secondary"
          >
            Sign Out & Reset
          </Button>
        </div>
      </Card>
    </div>
  );
}

const statBoxStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '1rem',
  margin: '1.5rem 0'
};

const statItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const statLabelStyle = {
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--text-muted)'
};

const statValStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: 'var(--text-inverse)',
  marginTop: '0.25rem'
};
