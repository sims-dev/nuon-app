import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const MentorHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    activeStudents: 0,
    totalEarnings: 0,
    rating: 4.8,
    upcomingSessions: []
  });

  useEffect(() => {
    // Load mentor stats from API
    loadMentorStats();
  }, []);

  const loadMentorStats = async () => {
    try {
      // Mock data for now - replace with actual API call
      setStats({
        totalSessions: 45,
        completedSessions: 42,
        activeStudents: 8,
        totalEarnings: 45000,
        rating: 4.8,
        upcomingSessions: [
          { id: 1, student: 'John Doe', time: '2024-01-15 14:00', topic: 'Emergency Care' },
          { id: 2, student: 'Jane Smith', time: '2024-01-16 10:00', topic: 'Patient Management' }
        ]
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div style={{
      background: `linear-gradient(135deg, ${color}15, ${color}08)`,
      border: `1px solid ${color}30`,
      borderRadius: '16px',
      padding: '24px',
      flex: 1,
      minWidth: '200px',
      margin: '8px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{
          background: color,
          borderRadius: '12px',
          padding: '8px',
          marginRight: '12px'
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{title}</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{value}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      minHeight: '100vh',
      color: '#fff',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '8px',
          background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Welcome back, {user?.name || 'Mentor'}!
        </h1>
        <p style={{ color: '#888', fontSize: '16px' }}>
          Here's what's happening with your mentoring sessions today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: '32px',
        justifyContent: 'space-between'
      }}>
        <StatCard
          title="Total Sessions"
          value={stats.totalSessions}
          icon="📚"
          color="#6366f1"
        />
        <StatCard
          title="Completed"
          value={stats.completedSessions}
          icon="✅"
          color="#10b981"
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon="👥"
          color="#f59e0b"
        />
        <StatCard
          title="Total Earnings"
          value={`₹${stats.totalEarnings}`}
          icon="💰"
          color="#ef4444"
        />
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

        {/* Left Column - Upcoming Sessions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            📅 Upcoming Sessions
          </h3>

          {stats.upcomingSessions.length > 0 ? (
            <div>
              {stats.upcomingSessions.map(session => (
                <div key={session.id} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{session.student}</div>
                      <div style={{ color: '#888', fontSize: '14px', marginBottom: '4px' }}>{session.topic}</div>
                      <div style={{ color: '#6366f1', fontSize: '14px' }}>{session.time}</div>
                    </div>
                    <button style={{
                      background: '#6366f1',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              color: '#888',
              padding: '40px 20px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
              <div>No upcoming sessions</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>Your schedule will appear here</div>
            </div>
          )}
        </div>

        {/* Right Column - Quick Actions & Profile */}
        <div>

          {/* Profile Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '40px',
              background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 16px',
              fontWeight: 'bold'
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'M'}
            </div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{user?.name}</h4>
            <p style={{ color: '#888', margin: '0 0 16px 0', fontSize: '14px' }}>
              {user?.specialization || 'Healthcare Professional'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: '#f59e0b', marginRight: '4px' }}>⭐</span>
              <span style={{ fontWeight: 'bold' }}>{stats.rating}</span>
              <span style={{ color: '#888', marginLeft: '4px' }}>({stats.totalSessions} reviews)</span>
            </div>
            <button
              onClick={() => window.location.href = '/mentor/profile'}
              style={{
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              Edit Profile
            </button>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Quick Actions</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '12px', fontSize: '18px' }}>📊</span>
                View Analytics
              </button>

              <button style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '12px', fontSize: '18px' }}>💬</span>
                Messages
              </button>

              <button style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '12px', fontSize: '18px' }}>⚙️</span>
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorHome;
