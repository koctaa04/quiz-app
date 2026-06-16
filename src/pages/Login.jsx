import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useQuiz } from '../context/QuizContext';

/**
 * Login view shell. Users input their name to start the technical quiz.
 */
export default function Login() {
  const [nameInput, setNameInput] = useState('');
  const { login } = useQuiz();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    
    // Save to context
    login(nameInput.trim());
    
    // Redirect to Quiz page
    navigate('/quiz');
  };

  return (
    <div className="container animate-fade-in" style={{ justifyContent: 'center' }}>
      <Card
        title="Technical Frontend Challenge"
        subtitle="Please enter your name to start the React Quiz challenge."
        glow={true}
        style={{ maxWidth: '420px', width: '100%' }}
      >
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="input-group">
            <label className="input-label" htmlFor="username">
              YOUR NAME
            </label>
            <input
              id="username"
              type="text"
              className="input-field"
              placeholder="e.g. John Doe"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            disabled={!nameInput.trim()}
            style={{ marginTop: '0.5rem' }}
          >
            Start Challenge
          </Button>
        </form>
      </Card>
    </div>
  );
}
