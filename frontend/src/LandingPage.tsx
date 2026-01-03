import React, { useState } from 'react';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showButton, setShowButton] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowButton(e.target.value.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password submission here
    console.log('Password submitted:', password);
  };

  return (
    <div className="landing-page">
      <div className="password-container">
        <form onSubmit={handleSubmit} className="password-form">
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter access password"
              className="password-input"
              autoComplete="current-password"
            />
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
