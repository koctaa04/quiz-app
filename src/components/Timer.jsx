import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

/**
 * Reusable premium Countdown Timer component.
 * Features progress indicator, dynamic warnings, and robust memory leak prevention.
 * 
 * @param {object} props
 * @param {number} props.duration - Initial duration in seconds (default: 300)
 * @param {function} props.onTimeUp - Callback function triggered when countdown hits 0
 */
export default function Timer({ duration = 300, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  // Use a ref to capture the latest onTimeUp callback.
  // This allows us to call the up-to-date callback without recreating the interval.
  const onTimeUpRef = useRef(onTimeUp);
  
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Synchronize timeLeft state with duration prop when it changes (e.g. on retry/reset)
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    // 1. Establish the interval timer
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        // If timer is about to hit zero, clean up and fire the callback
        if (prev <= 1) {
          clearInterval(intervalId);
          if (onTimeUpRef.current) {
            onTimeUpRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 2. Cleanup function to prevent memory leaks by clearing the interval
    // when the component is unmounted or when duration changes.
    return () => {
      clearInterval(intervalId);
    };
  }, [duration]);

  // Helper formatting for MM:SS display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Calculate remaining progress percentage
  const percentage = (timeLeft / duration) * 100;

  // Determine warning levels for dynamic aesthetics
  let statusClass = '';
  if (timeLeft <= 30) {
    statusClass = 'timer-critical';
  } else if (timeLeft <= 60) {
    statusClass = 'timer-warning';
  }

  return (
    <div className={`timer-container ${statusClass}`}>
      <span className="timer-label">Time Remaining</span>
      <div className="timer-time">
        <svg
          className="timer-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>{formattedTime}</span>
      </div>
      <div className="timer-progress-bar-wrapper">
        <div 
          className="timer-progress-bar" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
