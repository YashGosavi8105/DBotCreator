import React from 'react';
import '../index.css';
import "./Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const handleBotClick = (botName: string) => {
    alert(`Navigating to details for ${botName}`);
    // You can navigate to bot-specific routes here
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-image" />
        <h1 className="profile-title">Welcome to your profile</h1>
      </header>

      <div className="profile-content">
        <div className="placeholder-box">
          <h3>User Info</h3>
          <p>Name: John Doe</p>
          <p>Email: john@example.com</p>
        </div>

        <h2 className="section-heading">Your Bots</h2>

        <div className="bot-card" onClick={() => handleBotClick("Bot 1")}>
          <div className="bot-avatar" />
          <div className="bot-details">
            <h4>Bot 1</h4>
            <p>Status: Active</p>
          </div>
          <button className="add-button" onClick={(e) => { e.stopPropagation(); alert("Add Bot 1 to server") }}>
            Add to Server
          </button>
        </div>

        <div className="bot-card" onClick={() => handleBotClick("Bot 2")}>
          <div className="bot-avatar" />
          <div className="bot-details">
            <h4>Bot 2</h4>
            <p>Status: Offline</p>
          </div>
          <button className="add-button" onClick={(e) => { e.stopPropagation(); alert("Add Bot 2 to server") }}>
            Add to Server
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

