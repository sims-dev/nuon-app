import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Box, Typography, Card, CardContent, Button, Grid, Chip, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useSocket } from './SocketContext';

const initialRequests = [
  { id: 1, mentee: 'Alice', date: '2025-11-02', time: '10:00', status: 'pending', topic: 'React Basics', duration: 45 },
  { id: 2, mentee: 'Bob', date: '2025-11-03', time: '15:00', status: 'pending', topic: 'Career Guidance', duration: 60 },
];

const SessionRequests = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [reschedule, setReschedule] = useState({ date: '', time: '' });
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (socket && isConnected) {
      // Listen for new session requests
      const handleNewSessionRequest = (data) => {
        console.log('New session request received:', data);
        setRequests(prev => [...prev, {
          id: data.id,
          mentee: data.menteeName,
          date: data.date,
          time: data.time,
          status: 'pending',
          topic: data.topic,
          duration: data.duration
        }]);
      };

      // Listen for session request updates
      const handleSessionRequestUpdate = (data) => {
        console.log('Session request update:', data);
        setRequests(prev => prev.map(req =>
          req.id === data.requestId
            ? { ...req, status: data.status }
            : req
        ));
      };

      socket.on('new_session_request', handleNewSessionRequest);
      socket.on('session_request_update', handleSessionRequestUpdate);

      return () => {
        socket.off('new_session_request', handleNewSessionRequest);
        socket.off('session_request_update', handleSessionRequestUpdate);
      };
    }
  }, [socket, isConnected]);

  const handleAccept = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
  };
  const handleReject = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };
  const handleRescheduleOpen = (id) => {
    setRescheduleId(id);
    setReschedule({ date: '', time: '' });
  };
  const handleRescheduleSave = () => {
    setRequests(requests.map(r => r.id === rescheduleId ? { ...r, status: 'rescheduled', date: reschedule.date, time: reschedule.time } : r));
    setRescheduleId(null);
  };
  const handleStartSession = (id) => {
    alert('Zoom session would start for request #' + id);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 5, background: '#101010', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
          Session Requests
        </Typography>
        <Grid container spacing={3}>
          {requests.length === 0 && (
            <Grid item xs={12}>
              <Card sx={{ background: 'background.paper', border: '1px solid #00fff7', color: '#fff' }}>
                <CardContent>No session requests at the moment.</CardContent>
              </Card>
            </Grid>
          )}
          {requests.map((req) => (
            <Grid item xs={12} md={6} key={req.id}>
              <Card sx={{ background: 'background.paper', border: '1px solid #00fff7', color: '#fff', boxShadow: '0 0 16px #00fff733' }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                    <Typography variant="h6" sx={{ color: 'secondary.main' }}>{req.mentee}</Typography>
                    <Chip label={req.status.toUpperCase()} color={req.status === 'pending' ? 'warning' : req.status === 'accepted' ? 'success' : req.status === 'rejected' ? 'error' : 'info'} size="small" />
                  </Stack>
                  <Typography>Date: <b>{req.date}</b> at <b>{req.time}</b> ({req.duration} min)</Typography>
                  <Typography>Topic: {req.topic}</Typography>
                  <Stack direction="row" spacing={2} mt={2}>
                    {req.status === 'pending' && <Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={() => handleAccept(req.id)}>Accept</Button>}
                    {req.status === 'pending' && <Button variant="contained" color="error" startIcon={<CloseIcon />} onClick={() => handleReject(req.id)}>Reject</Button>}
                    {req.status === 'pending' && <Button variant="outlined" color="info" startIcon={<ScheduleIcon />} onClick={() => handleRescheduleOpen(req.id)}>Reschedule</Button>}
                    {req.status === 'accepted' && <Button variant="contained" color="primary" startIcon={<VideoCallIcon />} onClick={() => handleStartSession(req.id)}>Start Session</Button>}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
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
      </Box>
    </Box>
  );
};

export default SessionRequests;
