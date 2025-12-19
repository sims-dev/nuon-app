import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Box, Typography, Card, CardContent, Grid, Chip, Stack, IconButton } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';
import { useSocket } from './SocketContext';

const initialNotifications = [
  { id: 1, type: 'session', message: 'New session request from Alice', time: '2 min ago', status: 'unread' },
  { id: 2, type: 'feedback', message: 'You received feedback from Bob', time: '1 hr ago', status: 'unread' },
  { id: 3, type: 'reminder', message: 'Upcoming session with Charlie at 12:00', time: 'Today', status: 'read' },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (socket && isConnected) {
      // Listen for real-time notifications
      const handleNewNotification = (data) => {
        console.log('New notification received:', data);
        setNotifications(prev => [{
          id: Date.now(), // Use timestamp as ID for real-time notifications
          type: data.type || 'general',
          message: data.message,
          time: 'Just now',
          status: 'unread'
        }, ...prev]);
      };

      socket.on('notification', handleNewNotification);

      return () => {
        socket.off('notification', handleNewNotification);
      };
    }
  }, [socket, isConnected]);

  const handleDismiss = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 5, background: '#101010', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
          Notifications
        </Typography>
        <Grid container spacing={3}>
          {notifications.length === 0 && (
            <Grid item xs={12}>
              <Card sx={{ background: 'background.paper', border: '1px solid #00fff7', color: '#fff' }}>
                <CardContent>No notifications at the moment.</CardContent>
              </Card>
            </Grid>
          )}
          {notifications.map((note) => (
            <Grid item xs={12} md={8} key={note.id}>
              <Card sx={{ background: 'background.paper', border: '1px solid #00fff7', color: '#fff', boxShadow: '0 0 16px #00fff733', position: 'relative' }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                    <NotificationsActiveIcon color={note.status === 'unread' ? 'warning' : 'info'} />
                    <Typography variant="body1" sx={{ color: note.status === 'unread' ? 'warning.main' : 'info.main', fontWeight: note.status === 'unread' ? 'bold' : 'normal' }}>{note.message}</Typography>
                    <Chip label={note.type.toUpperCase()} color={note.type === 'session' ? 'primary' : note.type === 'feedback' ? 'success' : 'info'} size="small" />
                    <Typography variant="caption" sx={{ color: '#aaa', ml: 2 }}>{note.time}</Typography>
                    <IconButton size="small" onClick={() => handleDismiss(note.id)} sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Notifications;
