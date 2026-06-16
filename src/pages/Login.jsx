import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

/**
 * Login view shell. Users input their name to start the technical quiz.
 */
export default function Login() {
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = nameInput.trim();
    
    if (!trimmedName) {
      setError('Nama tidak boleh kosong');
      return;
    }
    
    setError('');
    // Save to context
    login(trimmedName);
    
    // Redirect to Quiz page
    navigate('/quiz');
  };

  const handleInputChange = (e) => {
    setNameInput(e.target.value);
    if (error) {
      setError('');
    }
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
              onChange={handleInputChange}
              autoFocus
              style={{
                borderColor: error ? 'var(--error)' : 'var(--border)',
                boxShadow: error ? '0 0 0 3px var(--error-glow)' : ''
              }}
            />
            
            {error && (
              <span style={{ 
                color: 'var(--error)', 
                fontSize: '0.85rem', 
                marginTop: '0.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                fontWeight: '500'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {error}
              </span>
            )}
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            style={{ marginTop: '0.5rem' }}
          >
            Start Challenge
          </Button>
        </form>
      </Card>
    </div>
  );
}
