import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Box, Typography, Card, CardContent, Grid, Chip, Stack, Rating } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

const initialHistory = [
  { id: 1, mentee: 'Alice', date: '2025-10-20', time: '10:00', status: 'completed', topic: 'React Basics', duration: 45, feedback: 'Great session!', rating: 5 },
  { id: 2, mentee: 'Bob', date: '2025-10-25', time: '15:00', status: 'completed', topic: 'Career Guidance', duration: 60, feedback: 'Very helpful.', rating: 4 },
  { id: 3, mentee: 'Charlie', date: '2025-11-05', time: '12:00', status: 'upcoming', topic: 'Interview Prep', duration: 30 },
];

const SessionHistory = () => {
  const [history] = useState(initialHistory);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 5, background: '#101010', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
          Session History
        </Typography>
        <Grid container spacing={3}>
          {history.length === 0 && (
            <Grid item xs={12}>
              <Card sx={{ background: 'background.paper', border: '1px solid #00fff7', color: '#fff' }}>
                <CardContent>No session history yet.</CardContent>
              </Card>
            </Grid>
          )}
          {history.map((session) => (
            <Grid item xs={12} md={6} key={session.id}>
              <Card sx={{ background: 'background.paper', border: '1px solid #00fff7', color: '#fff', boxShadow: '0 0 16px #00fff733' }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                    <HistoryIcon color={session.status === 'completed' ? 'success' : 'info'} />
                    <Typography variant="h6" sx={{ color: 'secondary.main' }}>{session.mentee}</Typography>
                    <Chip label={session.status.toUpperCase()} color={session.status === 'completed' ? 'success' : 'info'} size="small" />
                  </Stack>
                  <Typography>Date: <b>{session.date}</b> at <b>{session.time}</b> ({session.duration} min)</Typography>
                  <Typography>Topic: {session.topic}</Typography>
                  {session.status === 'completed' && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" sx={{ color: 'success.main' }}>Feedback:</Typography>
                      <Typography sx={{ mb: 1 }}>{session.feedback}</Typography>
                      <Rating value={session.rating} readOnly sx={{ color: '#00fff7' }} />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SessionHistory;
