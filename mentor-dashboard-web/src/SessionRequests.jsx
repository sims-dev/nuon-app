import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Box, Typography, Card, CardContent, Button, Grid, Chip, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Snackbar, CircularProgress } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LinkIcon from '@mui/icons-material/Link';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import api from './services/api';

const SessionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [reschedule, setReschedule] = useState({ date: '', time: '' });
  const [meetingLinks, setMeetingLinks] = useState({});
  const [userNotifications, setUserNotifications] = useState({});
  const [feedbackReceived, setFeedbackReceived] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { socket, isConnected } = useSocket();
  const { token } = useAuth();

  // Fetch mentor bookings
  const fetchBookings = async () => {
    try {
      if (token) {
        const response = await api.getMentorBookings(token);
        if (response.success) {
          setRequests(response.bookings || []);
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load bookings',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  useEffect(() => {
    if (socket && isConnected) {
      // Listen for booking updates
      const handleBookingUpdate = (data) => {
        console.log('Booking update received:', data);
        fetchBookings(); // Refresh bookings
      };

      // Listen for new bookings
      const handleNewBooking = (data) => {
        console.log('New booking received:', data);
        fetchBookings(); // Refresh bookings
      };

      // Listen for user joining notifications
      const handleUserJoining = (data) => {
        console.log('User joining notification:', data);
        setUserNotifications(prev => ({
          ...prev,
          [data.sessionId]: {
            userName: data.userName,
            message: `${data.userName} has joined your session!`,
            timestamp: new Date()
          }
        }));
        setSnackbar({
          open: true,
          message: `${data.userName} has joined your session!`,
          severity: 'info'
        });
      };

      // Listen for session started
      const handleSessionStarted = (data) => {
        console.log('Session started:', data);
        setMeetingLinks(prev => ({
          ...prev,
          [data.bookingId]: data.meetingLink
        }));
        fetchBookings(); // Refresh bookings
        setSnackbar({
          open: true,
          message: 'Session started successfully!',
          severity: 'success'
        });
      };

      socket.on('booking_created', handleNewBooking);
      socket.on('booking_accepted', handleBookingUpdate);
      socket.on('booking_rejected', handleBookingUpdate);
      socket.on('booking_rescheduled', handleBookingUpdate);
      socket.on('user_joined_session', handleUserJoining);
      socket.on('session_started', handleSessionStarted);

      return () => {
        socket.off('booking_created', handleNewBooking);
        socket.off('booking_accepted', handleBookingUpdate);
        socket.off('booking_rejected', handleBookingUpdate);
        socket.off('booking_rescheduled', handleBookingUpdate);
        socket.off('user_joined_session', handleUserJoining);
        socket.off('session_started', handleSessionStarted);
      };
    }
  }, [socket, isConnected]);

  const handleAccept = async (id) => {
    try {
      await api.acceptBooking(id, token);
      setSnackbar({
        open: true,
        message: 'Booking accepted successfully',
        severity: 'success'
      });
      fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Error accepting booking:', error);
      setSnackbar({
        open: true,
        message: 'Failed to accept booking',
        severity: 'error'
      });
    }
  };

  const handleReject = async (id) => {
    try {
      await api.rejectBooking(id, token);
      setSnackbar({
        open: true,
        message: 'Booking rejected successfully',
        severity: 'success'
      });
      fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Error rejecting booking:', error);
      setSnackbar({
        open: true,
        message: 'Failed to reject booking',
        severity: 'error'
      });
    }
  };

  const handleRescheduleOpen = (id) => {
    setRescheduleId(id);
    setReschedule({ date: '', time: '' });
  };

  const handleRescheduleSave = async () => {
    try {
      const newDateTime = new Date(`${reschedule.date}T${reschedule.time}`);
      await api.rescheduleBooking(rescheduleId, newDateTime.toISOString(), token);
      setRescheduleId(null);
      setSnackbar({
        open: true,
        message: 'Booking rescheduled successfully',
        severity: 'success'
      });
      fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      setSnackbar({
        open: true,
        message: 'Failed to reschedule booking',
        severity: 'error'
      });
    }
  };

  const handleStartSession = async (id) => {
    try {
      // Generate meeting link
      const mockMeetingLink = `https://zoom.us/j/${Math.random().toString(36).substr(2, 9)}`;

      await api.startSession(id, token, mockMeetingLink);

      // Store meeting link
      setMeetingLinks(prev => ({
        ...prev,
        [id]: mockMeetingLink
      }));

      setSnackbar({
        open: true,
        message: 'Session started successfully! User has been notified.',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error starting session:', error);
      setSnackbar({
        open: true,
        message: 'Failed to start session. Please try again.',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 5, background: '#101010', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
          Session Requests
        </Typography>
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: '#00fff7' }} />
              </Box>
            </Grid>
          ) : requests.length === 0 ? (
            <Grid item xs={12}>
              <Card sx={{ background: 'background.paper', border: '1px solid #00fff7', color: '#fff' }}>
                <CardContent>No session requests at the moment.</CardContent>
              </Card>
            </Grid>
          ) : (
            requests.map((req) => (
              <Grid item xs={12} md={6} key={req.id}>
                <Card sx={{ background: 'background.paper', border: '1px solid #00fff7', color: '#fff', boxShadow: '0 0 16px #00fff733' }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                      <Typography variant="h6" sx={{ color: 'secondary.main' }}>{req.nurse?.name || 'Unknown User'}</Typography>
                      <Chip label={req.status.toUpperCase()} color={req.status === 'pending' ? 'warning' : req.status === 'confirmed' ? 'success' : req.status === 'rejected' ? 'error' : req.status === 'in_progress' ? 'primary' : 'info'} size="small" />
                      {userNotifications[req.id] && (
                        <Chip label="USER JOINED" color="info" size="small" />
                      )}
                      {feedbackReceived[req.id] && (
                        <Chip label="FEEDBACK" color="success" size="small" />
                      )}
                    </Stack>
                    <Typography>Date: <b>{new Date(req.dateTime).toLocaleDateString()}</b> at <b>{new Date(req.dateTime).toLocaleTimeString()}</b></Typography>
                    <Typography>Topic: {req.notes || 'Mentorship Session'}</Typography>

                    {/* Meeting Link Display */}
                    {(meetingLinks[req.id] || req.zoomLink) && (
                      <Box sx={{ mt: 2, p: 2, backgroundColor: '#1a1a1a', borderRadius: 1, border: '1px solid #00fff7' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LinkIcon sx={{ color: '#00fff7' }} />
                          <Typography variant="body2" sx={{ color: '#00fff7', flex: 1 }}>
                            Meeting Link: {meetingLinks[req.id] || req.zoomLink}
                          </Typography>
                        </Stack>
                      </Box>
                    )}

                    {/* User Notification */}
                    {userNotifications[req.id] && (
                      <Alert severity="info" sx={{ mt: 1 }}>
                        {userNotifications[req.id].message}
                      </Alert>
                    )}

                    {/* Feedback Display */}
                    {feedbackReceived[req.id] && (
                      <Box sx={{ mt: 2, p: 2, backgroundColor: '#1a2e1a', borderRadius: 1, border: '1px solid #4caf50' }}>
                        <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                          Feedback from {feedbackReceived[req.id].userName}:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff', mt: 1 }}>
                          Rating: {'★'.repeat(feedbackReceived[req.id].rating)}
                        </Typography>
                        {feedbackReceived[req.id].feedback && (
                          <Typography variant="body2" sx={{ color: '#ccc', mt: 1 }}>
                            "{feedbackReceived[req.id].feedback}"
                          </Typography>
                        )}
                      </Box>
                    )}

                    <Stack direction="row" spacing={2} mt={2}>
                      {req.status === 'pending' && <Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={() => handleAccept(req.id)}>Accept</Button>}
                      {req.status === 'pending' && <Button variant="contained" color="error" startIcon={<CloseIcon />} onClick={() => handleReject(req.id)}>Reject</Button>}
                      {(req.status === 'pending' || req.status === 'confirmed') && <Button variant="outlined" color="info" startIcon={<ScheduleIcon />} onClick={() => handleRescheduleOpen(req.id)}>Reschedule</Button>}
                      {req.status === 'confirmed' && <Button variant="contained" color="primary" startIcon={<VideoCallIcon />} onClick={() => handleStartSession(req.id)}>Start Session</Button>}
                      {req.status === 'in_progress' && <Chip label="SESSION IN PROGRESS" color="primary" />}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
        <Dialog open={!!rescheduleId} onClose={() => setRescheduleId(null)}>
          <DialogTitle>Reschedule Session</DialogTitle>
          <DialogContent>
            <TextField label="Date" name="date" type="date" value={reschedule.date} onChange={e => setReschedule({ ...reschedule, date: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth sx={{ mb: 2 }} />
            <TextField label="Time" name="time" type="time" value={reschedule.time} onChange={e => setReschedule({ ...reschedule, time: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRescheduleId(null)} color="secondary">Cancel</Button>
            <Button onClick={handleRescheduleSave} color="primary" variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

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

export default SessionRequests;
