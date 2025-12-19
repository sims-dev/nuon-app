import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Box, Typography, Button, Card, CardContent, Grid, TextField, IconButton, List, ListItem, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';

const initialSlots = [
  { date: '2025-11-01', time: '10:00', duration: 45 },
  { date: '2025-11-02', time: '14:00', duration: 60 },
];

const Availability = () => {
  const [slots, setSlots] = useState(initialSlots);
  const [newSlot, setNewSlot] = useState({ date: '', time: '', duration: 45 });
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (socket && isConnected && user) {
      // Listen for mentor availability updates
      const handleMentorAvailabilityUpdate = (data) => {
        console.log('Mentor availability update:', data);
        if (data.mentorId === user.id) {
          // Update local slots based on the update
          if (data.action === 'add') {
            setSlots(prev => [...prev, {
              date: data.slot.date,
              time: data.slot.time,
              duration: data.slot.duration
            }]);
          } else if (data.action === 'remove') {
            setSlots(prev => prev.filter(slot =>
              !(slot.date === data.slot.date && slot.time === data.slot.time)
            ));
          }
        }
      };

      socket.on('mentor_availability_update', handleMentorAvailabilityUpdate);

      return () => {
        socket.off('mentor_availability_update', handleMentorAvailabilityUpdate);
      };
    }
  }, [socket, isConnected, user]);

  const handleChange = (e) => {
    setNewSlot({ ...newSlot, [e.target.name]: e.target.value });
  };

  const addSlot = () => {
    if (newSlot.date && newSlot.time && newSlot.duration) {
      const slotToAdd = { ...newSlot };
      setSlots([...slots, slotToAdd]);
      setNewSlot({ date: '', time: '', duration: 45 });

      // Emit availability update via socket
      if (socket && isConnected && user) {
        socket.emit('update_mentor_availability', {
          mentorId: user.id,
          action: 'add',
          slot: slotToAdd
        });
      }
    }
  };

  const removeSlot = (idx) => {
    const slotToRemove = slots[idx];
    setSlots(slots.filter((_, i) => i !== idx));

    // Emit availability update via socket
    if (socket && isConnected && user) {
      socket.emit('update_mentor_availability', {
        mentorId: user.id,
        action: 'remove',
        slot: slotToRemove
      });
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 5, background: '#101010', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
          Manage Availability
        </Typography>
        <Card sx={{ maxWidth: 600, background: 'background.paper', border: '1px solid #00fff7', boxShadow: '0 0 16px #00fff733', mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>Add New Slot</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <TextField
                  label="Date"
                  name="date"
                  type="date"
                  value={newSlot.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ mb: 1 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Time"
                  name="time"
                  type="time"
                  value={newSlot.time}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ mb: 1 }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Duration (min)"
                  name="duration"
                  type="number"
                  value={newSlot.duration}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 1 }}
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton color="primary" onClick={addSlot} sx={{ mt: 1 }}>
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ maxWidth: 600, background: 'background.paper', border: '1px solid #00fff7', boxShadow: '0 0 16px #00fff733' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>Your Slots</Typography>
            <List>
              {slots.length === 0 && <ListItem><ListItemText primary="No slots added yet." /></ListItem>}
              {slots.map((slot, idx) => (
                <ListItem key={idx} secondaryAction={
                  <IconButton edge="end" color="error" onClick={() => removeSlot(idx)}>
                    <DeleteIcon />
                  </IconButton>
                }>
                  <ListItemText
                    primary={`${slot.date} at ${slot.time}`}
                    secondary={`Duration: ${slot.duration} min`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Availability;
