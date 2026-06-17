import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import { useQuizQuestions } from '../hooks/useQuizQuestions';
import Timer from '../components/Timer';

/**
 * Quiz view. Displays loaded questions and manages quiz progress.
 * Focuses purely on the UI presentation layer.
 */
export default function Quiz() {
  const { user, logout } = useAuth();
  const { updateScore, clearQuizSession } = useQuiz();
  const navigate = useNavigate();

  // Consume logic, caching, loading, error, and retry states from custom hook
  const { questions, loading, error, retry } = useQuizQuestions();

  // Local UI-only progression states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Handle option selection
  const handleSelectOption = (option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }));
  };

  // Submit quiz score and navigate to result
  const handleSubmitQuiz = () => {
    let computedScore = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        computedScore += 1;
      }
    });
    updateScore(computedScore);
    navigate('/result');
  };

  // Handle when timer reaches 0: auto-submit and redirect
  const handleTimeUp = () => {
    let computedScore = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        computedScore += 1;
      }
    });
    updateScore(computedScore);
    navigate('/result', { state: { timeOut: true } });
  };

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

  // Loading Screen
  if (loading) {
    return (
      <div className="container animate-fade-in" style={{ justifyContent: 'center' }}>
        <Card
          title="Loading Quiz"
          subtitle="Fetching the best questions for you..."
          style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}
          glow={true}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2.5rem 0', gap: '1.5rem' }}>
            <div className="btn-spinner" style={{ width: '3rem', height: '3rem', borderWidth: '4px', borderTopColor: 'var(--primary)' }}></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Retrieving questions from Open Trivia Database...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Error Screen with Warning Icon and Try Again Button
  if (error) {
    return (
      <div className="container animate-fade-in" style={{ justifyContent: 'center' }}>
        <Card
          title="Failed to Load Quiz"
          subtitle="An error occurred while fetching question data."
          style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}
          glow={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem 0' }}>
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="var(--error)" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ marginBottom: '1.5rem' }}
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <p style={{ color: 'var(--text-main)', fontWeight: '500', marginBottom: '2rem', fontSize: '1rem', textAlign: 'center' }}>
              {error}
            </p>
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <Button onClick={() => navigate('/login')} variant="secondary" style={{ flex: 1 }}>
                Back to Login
              </Button>
              <Button onClick={retry} variant="primary" style={{ flex: 1 }}>
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Fallback in case of empty questions array
  if (questions.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ justifyContent: 'center' }}>
        <Card
          title="No Questions Available"
          subtitle="No questions were loaded."
          style={{ maxWidth: '400px', textAlign: 'center' }}
        >
          <Button onClick={retry} variant="primary" style={{ marginTop: '1rem' }}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const hasSelected = selectedAnswers[currentQuestionIndex] !== undefined;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Highlight style for selected choice Card
  const getOptionStyle = (option) => {
    const isSelected = selectedAnswers[currentQuestionIndex] === option;
    return {
      ...optionStyle,
      borderColor: isSelected ? 'var(--primary-light)' : 'var(--border)',
      background: isSelected ? 'var(--primary-glow)' : 'rgba(255, 255, 255, 0.03)',
      boxShadow: isSelected ? '0 0 12px var(--primary-glow)' : 'none'
    };
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ width: '100%', maxWidth: '650px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
        <div>
          <span className="badge badge-primary">Active Candidate</span>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-inverse)' }}>Candidate: {user}</h3>
        </div>
        <Timer duration={60} onTimeUp={handleTimeUp} />
        <Button onClick={() => { clearQuizSession(); logout(); navigate('/login'); }} variant="secondary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
          Quit Quiz
        </Button>
      </div>

      <Card
        title={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
        subtitle={`Category: ${currentQuestion.category}`}
        glow={true}
        style={{ maxWidth: '650px', width: '100%' }}
      >
        <div style={{ margin: '1.5rem 0' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-inverse)', fontWeight: '500', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            {currentQuestion.question}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentQuestion.options.map((option) => (
              <label style={getOptionStyle(option)} key={option}>
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option}
                  style={radioStyle}
                  checked={selectedAnswers[currentQuestionIndex] === option}
                  onChange={() => handleSelectOption(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
          <Button
            variant="secondary"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            style={{ width: '48%' }}
          >
            Previous
          </Button>
          
          {isLastQuestion ? (
            <Button
              onClick={handleSubmitQuiz}
              variant="primary"
              disabled={!hasSelected}
              style={{ width: '48%' }}
            >
              Finish & View Results
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              variant="primary"
              disabled={!hasSelected}
              style={{ width: '48%' }}
            >
              Next Question
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

// Layout options styles
const optionStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '1rem',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
  gap: '1rem',
  userSelect: 'none'
};

const radioStyle = {
  accentColor: 'var(--primary-light)',
  width: '18px',
  height: '18px',
  cursor: 'pointer'
};
