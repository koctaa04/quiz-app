import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { calculatePercentage, formatTime } from '../utils/helpers';

/**
 * Result view. Displays candidate performance and choices to retake or sign out.
 */
export default function Result() {
  const { user, logout } = useAuth();
  const { quizResult, score: contextScore, totalQuestions: contextTotalQuestions, resetQuiz, clearQuizSession } = useQuiz();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Derive stats with fallbacks from context in case of reload or direct access
  const result = quizResult || {
    username: user,
    score: contextScore,
    totalQuestions: contextTotalQuestions || 10,
    correctCount: contextScore,
    incorrectCount: Math.max(0, (contextTotalQuestions || 10) - contextScore),
    unansweredCount: 0,
    answeredCount: contextTotalQuestions || 10,
    timeLeft: 0,
    duration: 60,
    avgTimePerQuestion: 0,
    percentage: calculatePercentage(contextScore, contextTotalQuestions),
    passed: calculatePercentage(contextScore, contextTotalQuestions) >= 60,
    timeOut: location.state?.timeOut || false
  };

  const isTimeOut = result.timeOut || location.state?.timeOut || false;
  const percentage = result.percentage;
  const passed = result.passed;

  return (
    <div className="container animate-fade-in" style={{ justifyContent: 'center' }}>
      <Card
        title="Challenge Complete!"
        subtitle={`Here is your performance summary, ${result.username}.`}
        glow={true}
        style={{ maxWidth: '540px', width: '100%', textAlign: 'center', position: 'relative' }}
      >
        {/* Success/Failed Badge in top-right corner */}
        <div style={{ position: 'absolute', top: '1.75rem', right: '2rem', zIndex: 10 }}>
          {passed ? (
            <span className="badge badge-success" style={{ margin: 0 }}>Lolos!</span>
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
                background: 'var(--error-glow)',
                color: 'var(--error)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                margin: 0
              }}
            >
              Gagal!
            </span>
          )}
        </div>

        {isTimeOut && (
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
            Waktu Habis! Jawaban Anda telah dikirimkan secara otomatis.
          </div>
        )}

        <div style={{ margin: '1.5rem 0' }}>
          {/* Centered score display without percentage symbol */}
          <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 className="gradient-text" style={{ fontSize: '5.5rem', fontWeight: '800', lineHeight: 1, textAlign: 'center', margin: '0 0 0.5rem 0' }}>
              {percentage}
            </h1>
            <p style={{ marginTop: '0.25rem', fontSize: '1.1rem', textAlign: 'center' }}>
              {passed ? (
                <>Kerja bagus, <strong>{result.username}</strong>!</>
              ) : (
                <>Tetap berlatih, <strong>{result.username}</strong>!</>
              )}
            </p>
          </div>

          {/* Stats Grid Dashboard - 3 columns, 2 rows */}
          <div style={statsGridStyle}>
            {/* Row 1, Column 1: Jumlah Benar */}
            <div style={{ ...cardStatStyle, borderLeft: '3px solid var(--success)' }}>
              <span style={statIconWrapperStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </span>
              <span style={statLabelStyle}>Jumlah Benar</span>
              <span style={{ ...statValStyle, color: 'var(--success)' }}>{result.correctCount} Soal</span>
            </div>

            {/* Row 1, Column 2: Soal Dijawab */}
            <div style={{ ...cardStatStyle, borderLeft: '3px solid var(--accent)' }}>
              <span style={statIconWrapperStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </span>
              <span style={statLabelStyle}>Soal Dijawab</span>
              <span style={{ ...statValStyle, color: 'var(--accent)' }}>{result.answeredCount} / {result.totalQuestions}</span>
            </div>

            {/* Row 1, Column 3: Sisa Timer */}
            <div style={{ ...cardStatStyle, borderLeft: '3px solid var(--primary-light)' }}>
              <span style={statIconWrapperStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </span>
              <span style={statLabelStyle}>Sisa Timer</span>
              <span style={{ ...statValStyle, color: 'var(--primary-light)' }}>{formatTime(result.timeLeft)}</span>
            </div>

            {/* Row 2, Column 1: Jumlah Salah */}
            <div style={{ ...cardStatStyle, borderLeft: '3px solid var(--error)' }}>
              <span style={statIconWrapperStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </span>
              <span style={statLabelStyle}>Jumlah Salah</span>
              <span style={{ ...statValStyle, color: 'var(--error)' }}>{result.incorrectCount} Soal</span>
            </div>

            {/* Row 2, Column 2: Tidak Dijawab */}
            <div style={{ ...cardStatStyle, borderLeft: '3px solid var(--text-muted)' }}>
              <span style={statIconWrapperStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </span>
              <span style={statLabelStyle}>Tidak Dijawab</span>
              <span style={{ ...statValStyle, color: 'var(--text-muted)' }}>{result.unansweredCount} Soal</span>
            </div>

            {/* Row 2, Column 3: Rata-Rata Waktu */}
            <div style={{ ...cardStatStyle, borderLeft: '3px solid var(--accent)' }}>
              <span style={statIconWrapperStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </span>
              <span style={statLabelStyle}>Rata-Rata Waktu</span>
              <span style={{ ...statValStyle, color: 'var(--accent)' }}>{result.avgTimePerQuestion.toFixed(1)}s / soal</span>
            </div>
          </div>

          {/* Score Calculation Logic Panel */}
          <div style={logicCardStyle}>
            <div style={logicTitleStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Logika Perhitungan Skor
            </div>
            <p style={logicTextStyle}>
              Skor akhir dihitung berdasarkan persentase jawaban benar terhadap seluruh soal yang diujikan. 
              Setiap soal memiliki bobot nilai yang sama. 
              Rumus perhitungan yang digunakan adalah:
            </p>
            <div style={{ 
              background: 'rgba(0, 0, 0, 0.3)', 
              padding: '0.5rem 0.75rem', 
              borderRadius: '6px', 
              fontFamily: 'monospace', 
              fontSize: '0.85rem', 
              color: 'var(--text-inverse)', 
              margin: '0.75rem 0',
              textAlign: 'center',
              border: '1px solid var(--border)'
            }}>
              Skor = (Jumlah Benar / {result.totalQuestions}) &times; 100
            </div>
            <p style={logicTextStyle}>
              Jawaban salah atau soal yang tidak dijawab bernilai <strong>0 poin</strong>. Anda dinyatakan <strong>Lulus (Passed)</strong> jika skor mencapai minimal <strong>60%</strong>.
            </p>
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

// Custom Glassmorphic Layout Components Styles - 3 columns, 2 rows
const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '0.75rem',
  margin: '1.5rem 0',
  width: '100%'
};

const cardStatStyle = {
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  padding: '0.6rem 0.4rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
  gap: '0.2rem'
};

const statIconWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '0.15rem'
};

const statLabelStyle = {
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--text-muted)',
  textAlign: 'center'
};

const statValStyle = {
  fontSize: '0.95rem',
  fontWeight: '700',
  marginTop: '0.1rem',
  textAlign: 'center'
};

const logicCardStyle = {
  background: 'rgba(139, 92, 246, 0.05)',
  border: '1px solid rgba(139, 92, 246, 0.15)',
  borderRadius: '12px',
  padding: '1.25rem',
  margin: '1.5rem 0',
  textAlign: 'left',
  width: '100%'
};

const logicTitleStyle = {
  fontSize: '0.9rem',
  fontWeight: '700',
  color: 'var(--primary-light)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const logicTextStyle = {
  fontSize: '0.825rem',
  color: 'var(--text-muted)',
  lineHeight: '1.45',
  margin: '0'
};
