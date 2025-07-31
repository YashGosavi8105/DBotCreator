import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { BotTokenForm } from '@/components/BotTokenForm';
import { BotManagement } from '@/components/BotManagement';

// Mock hooks for demonstration - replace with your actual hooks
const useChat = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [botData, setBotData] = useState(null);
  const [geminiResponse, setGeminiResponse] = useState('');

  const sendMessage = (content) => {
    if (!content.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = "I'll help you create that Discord bot! Based on your description, I'll generate the necessary code and configuration files.";
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setGeminiResponse('# Discord Bot Code\n\nYour bot has been generated successfully!');
      setBotData({ name: 'Custom Bot', description: content });
      setIsLoading(false);
    }, 2000);
  };

  return { messages, isLoading, sendMessage, botData, geminiResponse };
};

const useDeployment = () => {
  const [status, setStatus] = useState('idle');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [setupInstructions, setSetupInstructions] = useState('');

  const deployBot = (botData) => {
    setStatus('deploying');
    setTimeout(() => {
      setStatus('success');
      setDownloadUrl('https://example.com/bot.zip');
      setSetupInstructions('Follow the README.md instructions to deploy your bot.');
    }, 3000);
  };

  const reset = () => {
    setStatus('idle');
    setDownloadUrl('');
    setSetupInstructions('');
  };

  return { status, deployBot, reset, downloadUrl, setupInstructions };
};

const createZipFromMarkdown = (content) => {
  console.log('Creating zip from markdown:', content);
  alert('Bot code download started!');
};

const Index = () => {
  const [currentView, setCurrentView] = useState('chat');
  const [step, setStep] = useState < 'chat' | 'deployment' > ('chat');
  const navigate = useNavigate(); // 2. Initialize the navigate function

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

  const handleTokenSubmit = (token) => {
    console.log('Token submitted:', token);
    alert('Bot token has been successfully added!');
    setCurrentView('management');
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    console.log(`Navigating to ${view}`);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <span role="img" aria-label="logo">👾</span> Discord Bot Wizard
        </div>
        <div className="header-center">
          {/* Navigation tabs */}
          <div className="nav-tabs">
            <button
              onClick={() => handleNavigation('chat')}
              className={`nav-tab ${currentView === 'chat' ? 'active' : ''}`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => handleNavigation('management')}
              className={`nav-tab ${currentView === 'management' ? 'active' : ''}`}
            >
              🤖 My Bots
            </button>
            <button
              onClick={() => handleNavigation('token')}
              className={`nav-tab ${currentView === 'token' ? 'active' : ''}`}
            >
              🔑 Add Token
            </button>
          </div>
        </div>
        <div className="header-right">
          {/* 3. Update the onClick handler to navigate to the profile page */}
          <button onClick={() => navigate('/profile')} className="profile-button" title="Go to Profile">👤</button>
        </div>
      </header>

      {/* The rest of your component remains the same... */}
      {currentView === 'chat' && (
        <>
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
        </>
      )}

      {currentView === 'management' && (
        <main className="management-container">
          <BotManagement />
        </main>
      )}

      {currentView === 'token' && (
        <main className="token-container">
          <BotTokenForm onTokenSubmit={handleTokenSubmit} />
        </main>
      )}

      <footer className="footer">© 2025 Discord Bot Wizard</footer>

      <style jsx>{`
        /* Styles remain unchanged */
        .app-container { min-height: 100vh; background-color: #1a1a1a; color: #fff; display: flex; flex-direction: column; }
        .app-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background-color: #2a2a2a; border-bottom: 1px solid #333; }
        .header-left { display: flex; align-items: center; gap: 0.5rem; font-size: 1.5rem; font-weight: bold; }
        .header-center { flex: 1; display: flex; justify-content: center; }
        .nav-tabs { display: flex; gap: 0.5rem; background-color: #333; padding: 0.25rem; border-radius: 6px; }
        .nav-tab { padding: 0.5rem 1rem; background: none; border: none; color: #ccc; cursor: pointer; border-radius: 4px; transition: all 0.2s; font-size: 0.9rem; }
        .nav-tab:hover { background-color: #444; color: #fff; }
        .nav-tab.active { background-color: #007acc; color: #fff; }
        .header-right { display: flex; align-items: center; }
        .profile-button { padding: 0.5rem; background-color: #333; color: #fff; border: none; border-radius: 50%; cursor: pointer; width: 40px; height: 40px; }
        .profile-button:hover { background-color: #444; }
        .chat-container, .management-container, .token-container { flex: 1; padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; }
        .chat-message { margin: 1rem 0; padding: 1rem; border-radius: 8px; background-color: #2a2a2a; }
        .chat-message.user { background-color: #007acc; margin-left: 20%; }
        .chat-message.assistant { background-color: #333; margin-right: 20%; }
        .loading { text-align: center; padding: 2rem; color: #888; }
        .chat-input-container { padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; display: flex; gap: 1rem; }
        .chat-input-container textarea { flex: 1; padding: 1rem; background-color: #2a2a2a; color: #fff; border: 1px solid #333; border-radius: 8px; resize: vertical; min-height: 100px; }
        .chat-input-container button { padding: 1rem 2rem; background-color: #007acc; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 1.5rem; }
        .download-btn-container { text-align: center; padding: 2rem; }
        .download-btn-container button { padding: 1rem 2rem; background-color: #28a745; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: bold; }
        .footer { text-align: center; padding: 2rem; background-color: #2a2a2a; border-top: 1px solid #333; color: #888; }
      `}</style>
    </div>
  );
};

export default Index;