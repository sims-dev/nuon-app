import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Box, Typography, Card, CardContent, Grid, Chip, Stack, IconButton, Button } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckIcon from '@mui/icons-material/Check';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import api from './services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();
  const { token } = useAuth();

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      if (token) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications?userId=${localStorage.getItem('userId')}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.map(note => ({
            id: note.id.toString(),
            type: note.type,
            message: note.message,
            title: note.title,
            time: new Date(note.createdAt).toLocaleString(),
            status: note.isRead ? 'read' : 'unread'
          })));
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  useEffect(() => {
    if (socket && isConnected) {
      // Listen for real-time notifications
      const handleNewNotification = (data) => {
        console.log('New notification received:', data);
        fetchNotifications(); // Refresh notifications
      };

      socket.on('notification', handleNewNotification);

      return () => {
        socket.off('notification', handleNewNotification);
      };
    }
  }, [socket, isConnected]);

  const handleGotIt = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Update local state
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, status: 'read' } : n
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 5, background: '#101010', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
          Notifications
        </Typography>
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <Typography sx={{ color: '#fff' }}>Loading notifications...</Typography>
              </Box>
            </Grid>
          ) : notifications.length === 0 ? (
            <Grid item xs={12}>
              <Card sx={{ background: 'background.paper', border: '1px solid #00fff7', color: '#fff' }}>
                <CardContent>No notifications at the moment.</CardContent>
              </Card>
            </Grid>
          ) : (
            notifications.map((note) => (
              <Grid item xs={12} md={8} key={note.id}>
                <Card sx={{ background: 'background.paper', border: '1px solid #00fff7', color: '#fff', boxShadow: '0 0 16px #00fff733' }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                      <NotificationsActiveIcon color={note.status === 'unread' ? 'warning' : 'info'} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: note.status === 'unread' ? 'warning.main' : 'info.main', fontWeight: note.status === 'unread' ? 'bold' : 'normal' }}>
                          {note.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ccc', mt: 1 }}>
                          {note.message}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#aaa', mt: 1, display: 'block' }}>
                          {note.time}
                        </Typography>
                      </Box>
                      <Chip label={note.type.toUpperCase()} color={note.type === 'session' ? 'primary' : note.type === 'feedback' ? 'success' : 'info'} size="small" />
                    </Stack>
                    {note.status === 'unread' && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CheckIcon />}
                        onClick={() => handleGotIt(note.id)}
                        sx={{ background: 'linear-gradient(45deg, #00fff7 30%, #00b4d8 90%)' }}
                      >
                        Got it
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Notifications;
