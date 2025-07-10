import React, { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useDeployment } from '@/hooks/useDeployment';
import { createZipFromMarkdown } from '@/lib/createZipFromMarkdown';
import { useNavigate } from 'react-router-dom';
import '../index.css';


const Index = () => {
  const [step, setStep] = useState<'chat' | 'deployment'>('chat');
  const navigate = useNavigate();

  const {
    messages,
    isLoading,
    sendMessage,
    botData,
    geminiResponse
  } = useChat({
    initialMessages: [{ role: 'assistant', content: "Hi! I'm the Discord Bot Wizard. Describe what kind of Discord bot you want to create, and I'll help you build it without writing any code." }]
  });

  const {
    status: deploymentStatus,
    deployBot,
    reset: resetDeployment,
    downloadUrl,
    setupInstructions
  } = useDeployment();

  const handleConfirmBot = () => {
    setStep('deployment');
    if (botData) deployBot(botData);
  };

  const handleDeploymentDone = () => {
    resetDeployment();
    setStep('chat');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <span role="img" aria-label="logo">👾</span> Discord Bot
        </div>
        <div className="header-right">
          <button onClick={() => navigate('/profile')} className="profile-button" title="Go to Profile">👤</button>
        </div>
      </header>

      <main className="chat-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role === 'user' ? 'user' : 'assistant'}`}>
            <strong>{msg.role === 'user' ? 'YOU' : ''}</strong> {msg.content}
          </div>
        ))}

        {isLoading && (
          <div className="loading">Thinking...</div>
        )}
      </main>

      <div className="chat-input-container">
        <textarea
          placeholder="e.g., I need a moderation bot that ..."
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        ></textarea>
        <button onClick={() => {
          const textarea = document.querySelector('textarea');
          if (textarea) sendMessage(textarea.value);
        }}>➤</button>
      </div>

      {geminiResponse && (
        <div className="download-btn-container">
          <button onClick={() => createZipFromMarkdown(geminiResponse)}>Download Bot Code</button>
        </div>
      )}

      <footer className="footer">© 2025 Discord Bot Wizard</footer>
    </div>
  );
};

export default Index;
