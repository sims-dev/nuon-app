import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// TODO: Replace this with your designed Mentor Dashboard
const MentorDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1>Mentor Dashboard</h1>
        <div>
          <span>Welcome, {user?.name}</span>
          <button 
            onClick={logout}
            style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* 
        🎯 PASTE YOUR MENTOR DASHBOARD CODE HERE
        
        Replace this placeholder content with your designed mentor dashboard.
        You can organize it into separate components like:
        - Availability Management
        - Session Management
        - Student Progress
        - Feedback System
      */}
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '2rem', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2>👨‍🏫 Mentor Dashboard Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
          
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
            <h3>📅 Availability Management</h3>
            <p>Set your available time slots for mentorship</p>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
            <h3>💻 Zoom Sessions</h3>
            <p>Manage your mentorship sessions</p>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
            <h3>👥 Students</h3>
            <p>View your mentees and their progress</p>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
            <h3>📝 Feedback</h3>
            <p>Provide feedback after sessions</p>
          </div>
          
        </div>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#e7f3ff', 
          borderRadius: '8px',
          border: '2px dashed #007bff'
        }}>
          <h3>🚀 Ready for Your Dashboard!</h3>
          <p>
            <strong>Paste your mentor dashboard code in:</strong><br/>
            <code>src/pages/mentor/MentorDashboard.js</code>
          </p>
          <p>Your dashboard will have access to:</p>
          <ul style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>✅ Mentor availability APIs</li>
            <li>✅ Zoom integration</li>
            <li>✅ Session management</li>
            <li>✅ Student feedback system</li>
          </ul>
        </div>
      </div>

      <Routes>
        {/* Add your mentor sub-routes here */}
      </Routes>
    </div>
  );
};

export default MentorDashboard;