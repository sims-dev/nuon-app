import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Box, Typography, Card, CardContent, Grid, Chip, Stack, Button, Alert, Snackbar, CircularProgress } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import api from './services/api';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { socket, isConnected } = useSocket();
  const { token } = useAuth();

  // Fetch mentor bookings (confirmed, in_progress, and pending)
  const fetchSessions = async () => {
    try {
      if (token) {
        const response = await api.getMentorBookings(token);
        if (response.success) {
          // Filter for confirmed, in_progress, and pending sessions
          const activeSessions = response.bookings.filter(booking =>
            booking.status === 'confirmed' || booking.status === 'in_progress' || booking.status === 'pending'
          );
          setSessions(activeSessions || []);
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load sessions',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [token]);

  useEffect(() => {
    if (socket && isConnected) {
      // Listen for booking updates
      const handleBookingUpdate = (data) => {
        console.log('Booking update received:', data);
        fetchSessions(); // Refresh sessions
      };

      socket.on('booking_accepted', handleBookingUpdate);
      socket.on('booking_rescheduled', handleBookingUpdate);
      socket.on('session_started', handleBookingUpdate);

      return () => {
        socket.off('booking_accepted', handleBookingUpdate);
        socket.off('booking_rescheduled', handleBookingUpdate);
        socket.off('session_started', handleBookingUpdate);
      };
    }
  }, [socket, isConnected]);

  const handleJoinSession = (session) => {
    // Open Zoom link in new tab
    if (session.zoomLink) {
      window.open(session.zoomLink, '_blank');
    } else {
      setSnackbar({
        open: true,
        message: 'Meeting link not available yet',
        severity: 'warning'
      });
    }
  };

  const handleReschedule = (session) => {
    // For mentors, they might need to contact admin or use a different flow
    // For now, show a message that rescheduling should be done through admin
    setSnackbar({
      open: true,
      message: 'Please contact admin to reschedule this session',
      severity: 'info'
    });
  };

  const isSessionActive = (sessionDateTime) => {
    const now = new Date();
    const sessionTime = new Date(sessionDateTime);
    const timeDiff = sessionTime - now;
    // Active if within 5 minutes before to 45 minutes after
    return timeDiff <= 5 * 60 * 1000 && timeDiff >= -45 * 60 * 1000;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 5, background: '#101010', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
          My Sessions
        </Typography>
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: '#00fff7' }} />
              </Box>
            </Grid>
          ) : sessions.length === 0 ? (
            <Grid item xs={12}>
              <Card sx={{ background: 'background.paper', border: '1px solid #00fff7', color: '#fff' }}>
                <CardContent>No upcoming sessions.</CardContent>
              </Card>
            </Grid>
          ) : (
            sessions.map((session) => (
              <Grid item xs={12} md={6} key={session.id}>
                <Card sx={{ background: 'background.paper', border: '1px solid #00fff7', color: '#fff', boxShadow: '0 0 16px #00fff733' }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                      <Typography variant="h6" sx={{ color: 'secondary.main' }}>{session.nurse?.name || 'Unknown User'}</Typography>
                      <Chip label={session.status.toUpperCase()} color={session.status === 'confirmed' ? 'success' : 'primary'} size="small" />
                      {isSessionActive(session.dateTime) && (
                        <Chip label="ACTIVE" color="info" size="small" />
                      )}
                    </Stack>
                    <Typography>Date: <b>{new Date(session.dateTime).toLocaleDateString()}</b> at <b>{new Date(session.dateTime).toLocaleTimeString()}</b></Typography>
                    <Typography>Topic: {session.notes || 'Mentorship Session'}</Typography>
                    <Typography>Price: {session.mentor?.price === 0 ? <span style={{ color: '#10b981', fontWeight: 'bold' }}>FREE</span> : <span style={{ color: '#f97316', fontWeight: 'bold' }}>₹{session.mentor?.price}</span>}</Typography>

                    {/* Meeting Link Display */}
                    {session.zoomLink && (
                      <Box sx={{ mt: 2, p: 2, backgroundColor: '#1a1a1a', borderRadius: 1, border: '1px solid #00fff7' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <VideoCallIcon sx={{ color: '#00fff7' }} />
                          <Typography variant="body2" sx={{ color: '#00fff7', flex: 1 }}>
                            Meeting Link: {session.zoomLink}
                          </Typography>
                        </Stack>
                      </Box>
                    )}

                    <Stack direction="row" spacing={2} mt={2}>
                      {session.status === 'pending' && (
                        <Chip label="Awaiting Mentor Confirmation" color="warning" sx={{ flex: 1, justifyContent: 'center' }} />
                      )}
                      {session.status === 'confirmed' && !isSessionActive(session.dateTime) && (
                        <>
                          <Button
                            variant="outlined"
                            onClick={() => handleReschedule(session)}
                            sx={{
                              borderColor: '#d1d5db',
                              color: '#374151',
                              borderRadius: '9999px',
                              flex: 1
                            }}
                          >
                            Reschedule
                          </Button>
                          <Chip label="CONFIRMED" color="success" />
                        </>
                      )}
                      {isSessionActive(session.dateTime) && (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<VideoCallIcon />}
                          onClick={() => handleJoinSession(session)}
                          sx={{
                            background: '#10b981',
                            borderRadius: '9999px',
                            flex: 1
                          }}
                        >
                          Join Now
                        </Button>
                      )}
                      {session.status === 'in_progress' && (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<VideoCallIcon />}
                          onClick={() => handleJoinSession(session)}
                          sx={{
                            background: '#10b981',
                            borderRadius: '9999px',
                            flex: 1
                          }}
                        >
                          Rejoin Session
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default MySessions;