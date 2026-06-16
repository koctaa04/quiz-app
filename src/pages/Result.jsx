import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useQuiz } from '../context/QuizContext';

/**
 * Result view shell. Displays candidate performance and choices to retake or sign out.
 */
export default function Result() {
  const { user, score, resetQuiz } = useQuiz();
  const navigate = useNavigate();

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

  // Calculate generic score display for the placeholder
  const percentage = 80; // Hardcoded default score for demonstration

  return (
    <div className="container animate-fade-in" style={{ justifyContent: 'center' }}>
      <Card
        title="Challenge Complete!"
        subtitle="Here is your performance summary."
        glow={true}
        style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}
      >
        <div style={{ margin: '2rem 0' }}>
          <span className="badge badge-success">Passed</span>
          
          <div style={{ margin: '1.5rem 0' }}>
            <h1 className="gradient-text" style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: 1 }}>
              {percentage}%
            </h1>
            <p style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>
              Well done, <strong>{user}</strong>!
            </p>
          </div>

          <div style={statBoxStyle}>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>Score</span>
              <span style={statValStyle}>4 / 5</span>
            </div>
            <div style={{ width: '1px', background: 'var(--border)', height: '40px' }}></div>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>Accuracy</span>
              <span style={statValStyle}>80%</span>
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
              resetQuiz();
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
