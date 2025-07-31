import React, { useEffect, useState } from 'react';
import '../index.css';
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { log } from 'console';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          console.log("User data:", data);
          setUser(data);
        } else {
          navigate("/login");
        }
      })
      .catch((e) => (
        console.log("Error fetching user data:", e),
        navigate("/login")
      ));
  }, [navigate]);

  const handleBotClick = (botName: string) => {
    alert(`Navigating to details for ${botName}`);
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        {user && (
          <>
            <img
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
              alt="Profile"
              className="profile-image"
            />
            <h1 className="profile-title">Welcome, {user.username}!</h1>
          </>
        )}
      </header>

      <div className="profile-content">
        <div className="placeholder-box">
          <h3>User Info</h3>
          <p>Name: {user?.username}</p>
          <p>Email: {user?.email}</p>
        </div>

        <h2 className="section-heading">Your Bots</h2>

        <div className="bot-card" onClick={() => handleBotClick("Bot 1")}>
          <div className="bot-avatar" />
          <div className="bot-details">
            <h4>Bot 1</h4>
            <p>Status: Active</p>
          </div>
          <button
            className="add-button"
            onClick={(e) => {
              e.stopPropagation();
              alert("Add Bot 1 to server");
            }}
          >
            Add to Server
          </button>
        </div>

        <div className="bot-card" onClick={() => handleBotClick("Bot 2")}>
          <div className="bot-avatar" />
          <div className="bot-details">
            <h4>Bot 2</h4>
            <p>Status: Offline</p>
          </div>
          <button
            className="add-button"
            onClick={(e) => {
              e.stopPropagation();
              alert("Add Bot 2 to server");
            }}
          >
            Add to Server
          </button>
        </div>
      </div>
    </div>
  );
};
console.log("Profile component loaded");
export default Profile;
