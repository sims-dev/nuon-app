import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useSocket } from './SocketContext';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import MessageIcon from '@mui/icons-material/Message';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import SendIcon from '@mui/icons-material/Send';

const stats = [
  { label: 'Total Sessions', value: 0 },
  { label: 'Upcoming', value: 0 },
  { label: 'Attended', value: 0 },
  { label: 'Yet to Attend', value: 0 },
];

const DashboardHome = () => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [stats, setStats] = useState([
    { label: 'Total Sessions', value: 0 },
    { label: 'Upcoming', value: 0 },
    { label: 'Attended', value: 0 },
    { label: 'Yet to Attend', value: 0 },
  ]);

  useEffect(() => {
    if (socket && isConnected) {
      const handleAdminMessage = (messageData) => {
        setMessages(prev => [...prev, { ...messageData, direction: 'incoming' }]);
        setUnreadCount(prev => prev + 1);
      };

      socket.on('admin_message', handleAdminMessage);

      // Fetch real-time stats from backend
      const fetchStats = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/mentor/stats`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('mentor_token')}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setStats([
              { label: 'Total Sessions', value: data.totalSessions || 0 },
              { label: 'Upcoming', value: data.upcomingSessions || 0 },
              { label: 'Attended', value: data.attendedSessions || 0 },
              { label: 'Yet to Attend', value: data.pendingSessions || 0 },
            ]);
          }
        } catch (error) {
          console.error('Failed to fetch mentor stats:', error);
        }
      };

      fetchStats();

      return () => {
        socket.off('admin_message', handleAdminMessage);
      };
    }
  }, [socket, isConnected]);

  const handleSendMessage = () => {
    if (socket && newMessage.trim()) {
      // Get admin ID - you might need to fetch this or store it
      const adminId = 'admin_id_here'; // Replace with actual admin ID logic
      socket.emit('send_mentor_message', {
        adminId,
        message: newMessage.trim()
      });
      setMessages(prev => [...prev, {
        from: 'current_user', // Replace with actual user ID
        fromName: 'You',
        to: adminId,
        message: newMessage.trim(),
        timestamp: new Date(),
        type: 'mentor_to_admin',
        direction: 'outgoing'
      }]);
      setNewMessage('');
    }
  };

  const handleOpenMessages = () => {
    setMessageDialogOpen(true);
    setUnreadCount(0);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 5, background: '#101010', minHeight: '100vh' }}>
        {/* Messages Button */}
        <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
          <IconButton onClick={handleOpenMessages} sx={{ color: '#fff' }}>
            <Badge badgeContent={unreadCount} color="error">
              <MessageIcon />
            </Badge>
          </IconButton>
        </Box>

        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 4 }}>
          Mentor Dashboard
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Card sx={{ background: '#181818', color: '#fff' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#0af' }}>{stat.label}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stat.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>Quick Actions</Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button component={Link} to="/mentor/profile" variant="contained" color="primary">Edit Profile</Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/mentor/availability" variant="contained" color="primary">Set Availability</Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/mentor/sessions" variant="contained" color="primary">Session Requests</Button>
          </Grid>
          <Grid item>
            <Button component={Link} to="/mentor/history" variant="contained" color="primary">Session History</Button>
          </Grid>
        </Grid>

        {/* Messages Dialog */}
        <Dialog open={messageDialogOpen} onClose={() => setMessageDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Messages with Admin</DialogTitle>
          <DialogContent>
            <Box sx={{ height: 300, overflow: 'auto', mb: 2 }}>
              <List>
                {messages.map((msg, index) => (
                  <ListItem key={index} sx={{ flexDirection: 'column', alignItems: msg.direction === 'outgoing' ? 'flex-end' : 'flex-start' }}>
                    <Box sx={{ maxWidth: '70%', p: 1, bgcolor: msg.direction === 'outgoing' ? '#e3f2fd' : '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="body1">{msg.message}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(msg.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                startIcon={<SendIcon />}
              >
                Send
              </Button>
            </Box>
            <Chip
              label={isConnected ? "Connected" : "Disconnected"}
              color={isConnected ? "success" : "error"}
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMessageDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default DashboardHome;
