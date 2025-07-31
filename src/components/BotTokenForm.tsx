import React, { useState } from 'react';

export const BotTokenForm = ({ onTokenSubmit }) => {
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const validateAndSubmit = async () => {
    setIsValidating(true);
    setError('');

    try {
      const response = await fetch('/api/bot/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token })
      });

      if (response.ok) {
        onTokenSubmit(token);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid bot token');
      }
    } catch (err) {
      setError('Failed to validate token');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="bot-token-form">
      <h3>Add Your Discord Bot Token</h3>
      <p>Add your Discord bot token here to make it available for deployment in the "My Bots" tab.</p>
      <div className="form-group">
        <label>Bot Token:</label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Your Discord bot token..."
        />
        {error && <div className="error">{error}</div>}
      </div>
      <button
        onClick={validateAndSubmit}
        disabled={!token || isValidating}
      >
        {isValidating ? 'Validating...' : 'Add Bot Token'}
      </button>
    </div>
  );
};