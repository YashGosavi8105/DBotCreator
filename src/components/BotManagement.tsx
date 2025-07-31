import React, { useState, useEffect } from 'react';

interface Bot {
  id: number;
  botName: string;
  description: string;
  status: string;
  createdAt: string;
  processId?: number;
  installCount?: number;
  commands?: string;
  features?: string;
}

interface BotManagementProps {
  bots?: Bot[];
  onBotsUpdate?: () => Promise<void>;
}

export const BotManagement: React.FC<BotManagementProps> = ({ 
  bots: propBots, 
  onBotsUpdate 
}) => {
  const [bots, setBots] = useState<Bot[]>(propBots || []);
  const [deploymentStatus, setDeploymentStatus] = useState<Record<number, string>>({});
  const [logs, setLogs] = useState<Record<number, string>>({});
  const [showLogs, setShowLogs] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (propBots) {
      setBots(propBots);
    } else {
      fetchUserBots();
    }
  }, [propBots]);

  const fetchUserBots = async () => {
    try {
      const response = await fetch('/api/bot/instances', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setBots(data);
      }
    } catch (error) {
      console.error('Failed to fetch user bots:', error);
    }
  };

  const startBot = async (botId: number) => {
    setDeploymentStatus(prev => ({ ...prev, [botId]: 'starting' }));
    
    try {
      const response = await fetch(`/api/bot/${botId}/start`, {
        method: 'POST',
        credentials: 'include'
      });
      
      const result = await response.json();
      if (result.success) {
        setDeploymentStatus(prev => ({ ...prev, [botId]: 'running' }));
        // Refresh the bot list
        if (onBotsUpdate) {
          await onBotsUpdate();
        } else {
          await fetchUserBots();
        }
      } else {
        setDeploymentStatus(prev => ({ ...prev, [botId]: 'failed' }));
      }
    } catch (error) {
      console.error('Failed to start bot:', error);
      setDeploymentStatus(prev => ({ ...prev, [botId]: 'failed' }));
    }
  };

  const stopBot = async (botId: number) => {
    setDeploymentStatus(prev => ({ ...prev, [botId]: 'stopping' }));
    
    try {
      const response = await fetch(`/api/bot/${botId}/stop`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setDeploymentStatus(prev => ({ ...prev, [botId]: 'stopped' }));
        // Refresh the bot list
        if (onBotsUpdate) {
          await onBotsUpdate();
        } else {
          await fetchUserBots();
        }
      }
    } catch (error) {
      console.error('Failed to stop bot:', error);
      setDeploymentStatus(prev => ({ ...prev, [botId]: 'failed' }));
    }
  };

  const restartBot = async (botId: number) => {
    setDeploymentStatus(prev => ({ ...prev, [botId]: 'restarting' }));
    
    try {
      const response = await fetch(`/api/bot/${botId}/restart`, {
        method: 'POST',
        credentials: 'include'
      });
      
      const result = await response.json();
      if (result.success) {
        setDeploymentStatus(prev => ({ ...prev, [botId]: 'running' }));
        if (onBotsUpdate) {
          await onBotsUpdate();
        } else {
          await fetchUserBots();
        }
      } else {
        setDeploymentStatus(prev => ({ ...prev, [botId]: 'failed' }));
      }
    } catch (error) {
      console.error('Failed to restart bot:', error);
      setDeploymentStatus(prev => ({ ...prev, [botId]: 'failed' }));
    }
  };

  const deleteBot = async (botId: number) => {
    if (!confirm('Are you sure you want to delete this bot? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/bot/${botId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Remove from local state
        setBots(prev => prev.filter(bot => bot.id !== botId));
        // Refresh if callback provided
        if (onBotsUpdate) {
          await onBotsUpdate();
        }
      }
    } catch (error) {
      console.error('Failed to delete bot:', error);
    }
  };

  const viewLogs = async (botId: number) => {
    try {
      const response = await fetch(`/api/bot/${botId}/logs`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const logData = await response.text();
        setLogs(prev => ({ ...prev, [botId]: logData }));
        setShowLogs(prev => ({ ...prev, [botId]: true }));
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setLogs(prev => ({ ...prev, [botId]: 'Failed to load logs' }));
      setShowLogs(prev => ({ ...prev, [botId]: true }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running': return '#28a745';
      case 'stopped': return '#6c757d';
      case 'error': return '#dc3545';
      case 'deploying': return '#ffc107';
      case 'restarting': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running': return '🟢';
      case 'stopped': return '⭕';
      case 'error': return '🔴';
      case 'deploying': return '🟡';
      case 'restarting': return '🔄';
      default: return '⚪';
    }
  };

  return (
    <div className="bot-management">
      <div className="management-header">
        <h2>My Discord Bots</h2>
        <p>Manage and monitor your deployed Discord bots</p>
      </div>

      {bots.length === 0 ? (
        <div className="no-bots">
          <div className="no-bots-icon">🤖</div>
          <h3>No bots created yet</h3>
          <p>Create your first Discord bot by going to the Chat tab and describing what you want your bot to do!</p>
        </div>
      ) : (
        <div className="bots-grid">
          {bots.map(bot => (
            <div key={bot.id} className="bot-card">
              <div className="bot-header">
                <h3>{bot.botName}</h3>
                <div className="bot-status" style={{ color: getStatusColor(deploymentStatus[bot.id] || bot.status) }}>
                  {getStatusIcon(deploymentStatus[bot.id] || bot.status)}
                  {deploymentStatus[bot.id] || bot.status}
                </div>
              </div>

              <div className="bot-info">
                <p className="bot-description">{bot.description}</p>
                <div className="bot-meta">
                  <span>Created: {new Date(bot.createdAt).toLocaleDateString()}</span>
                  {bot.processId && <span>Process ID: {bot.processId}</span>}
                  {bot.installCount !== undefined && <span>Installs: {bot.installCount}</span>}
                </div>
              </div>

              {bot.features && (
                <div className="bot-features">
                  <strong>Features:</strong>
                  <div className="feature-tags">
                    {JSON.parse(bot.features).map((feature: string, index: number) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                </div>
              )}

              {bot.commands && (
                <div className="bot-commands">
                  <strong>Commands:</strong>
                  <div className="command-list">
                    {JSON.parse(bot.commands).map((command: string, index: number) => (
                      <code key={index} className="command">{command}</code>
                    ))}
                  </div>
                </div>
              )}

              <div className="bot-actions">
                {(bot.status === 'STOPPED' || bot.status === 'ERROR') && (
                  <button 
                    onClick={() => startBot(bot.id)}
                    disabled={deploymentStatus[bot.id] === 'starting'}
                    className="action-btn start-btn"
                  >
                    {deploymentStatus[bot.id] === 'starting' ? '🔄 Starting...' : '▶️ Start'}
                  </button>
                )}
                
                {bot.status === 'RUNNING' && (
                  <>
                    <button 
                      onClick={() => stopBot(bot.id)}
                      disabled={deploymentStatus[bot.id] === 'stopping'}
                      className="action-btn stop-btn"
                    >
                      {deploymentStatus[bot.id] === 'stopping' ? '🔄 Stopping...' : '⏹️ Stop'}
                    </button>
                    <button 
                      onClick={() => restartBot(bot.id)}
                      disabled={deploymentStatus[bot.id] === 'restarting'}
                      className="action-btn restart-btn"
                    >
                      {deploymentStatus[bot.id] === 'restarting' ? '🔄 Restarting...' : '🔄 Restart'}
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => viewLogs(bot.id)}
                  className="action-btn logs-btn"
                >
                  📋 Logs
                </button>
                
                <button 
                  onClick={() => deleteBot(bot.id)}
                  className="action-btn delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>

              {deploymentStatus[bot.id] && (
                <div className={`status-message ${deploymentStatus[bot.id]}`}>
                  {deploymentStatus[bot.id]}
                </div>
              )}

              {showLogs[bot.id] && (
                <div className="logs-modal">
                  <div className="logs-header">
                    <h4>Bot Logs - {bot.botName}</h4>
                    <button 
                      onClick={() => setShowLogs(prev => ({ ...prev, [bot.id]: false }))}
                      className="close-logs"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="logs-content">
                    <pre>{logs[bot.id] || 'Loading logs...'}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};