import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TypingEffect from './components/TypingEffect';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowButton(e.target.value.length > 0);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Faz#2527') {
      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
      setShowButton(false);
    }
  };

  return (
    <div className="landing-page">
      <div className="password-container">
        <TypingEffect text="FAZ CASHEWS...." speed={150} />
        <form onSubmit={handleSubmit} className="password-form">
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter access password"
              className="password-input"
              autoComplete="current-password"
              autoFocus
            />
            {error && <p className="error-message">{error}</p>}
            {showButton && (
              <button type="submit" className="submit-button">
                Enter
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="gradient-section"></div>
    </div>
  );
};

export default LandingPage;
