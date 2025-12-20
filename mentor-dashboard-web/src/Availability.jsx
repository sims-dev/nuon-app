import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Box, Typography, Button, Card, CardContent, Grid, TextField, IconButton, List, ListItem, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from './AuthContext';
import { IP_ADDRESS } from './config/ipConfig';

const Availability = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSlot, setNewSlot] = useState({ title: '', description: '', startDateTime: '', endDateTime: '', duration: 45, maxBookings: 1, price: 0, sessionType: 'mentoring', meetingType: 'zoom', specializations: [] });
  const { user } = useAuth();

  const API_BASE = (process.env.REACT_APP_API_BASE_URL || `http://${IP_ADDRESS}:5000/api`) + '/mentors/mentor';

  // Fetch availability
  const fetchAvailability = () => {
    setLoading(true);
    fetch(`${API_BASE}/availability?upcoming=true`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setSlots(data.availability || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load availability');
        setLoading(false);
      });
  };

  useEffect(() => { fetchAvailability(); }, []);

  const handleChange = (e) => {
    setNewSlot({ ...newSlot, [e.target.name]: e.target.value });
  };

  const addSlot = async () => {
    if (newSlot.startDateTime && newSlot.endDateTime && newSlot.duration) {
      // Basic frontend validation
      const start = new Date(newSlot.startDateTime);
      const end = new Date(newSlot.endDateTime);
      const now = new Date();

      if (start >= end) {
        setError('Start time must be before end time');
        return;
      }

      if (start <= now) {
        setError('Start time must be in the future');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/availability`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify(newSlot)
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to add slot');
        }
        fetchAvailability();
        setNewSlot({ title: '', description: '', startDateTime: '', endDateTime: '', duration: 45, maxBookings: 1, price: 0, sessionType: 'mentoring', meetingType: 'zoom', specializations: [] });
        setError(''); // Clear any previous errors
      } catch (error) {
        setError(error.message || 'Failed to add slot');
      }
    }
  };

  const removeSlot = async (slotId) => {
    try {
      const res = await fetch(`${API_BASE}/availability/${slotId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete slot');
      fetchAvailability();
    } catch {
      setError('Failed to delete slot');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 5, background: '#101010', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
          Manage Availability
        </Typography>
        {loading ? <Typography sx={{ color: '#fff' }}>Loading...</Typography> : (
          <>
            <Card sx={{ maxWidth: 800, background: 'background.paper', border: '1px solid #00fff7', boxShadow: '0 0 16px #00fff733', mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>Add New Slot</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Title"
                      name="title"
                      value={newSlot.title}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Description"
                      name="description"
                      value={newSlot.description}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Start Date & Time"
                      name="startDateTime"
                      type="datetime-local"
                      value={newSlot.startDateTime}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: new Date().toISOString().slice(0, 16) }}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="End Date & Time"
                      name="endDateTime"
                      type="datetime-local"
                      value={newSlot.endDateTime}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: new Date().toISOString().slice(0, 16) }}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
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
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Max Bookings"
                      name="maxBookings"
                      type="number"
                      value={newSlot.maxBookings}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Price (₹)"
                      name="price"
                      type="number"
                      value={newSlot.price}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={addSlot} startIcon={<AddIcon />}>
                      Add Slot
                    </Button>
                  </Grid>
                </Grid>
                {error && <Typography sx={{ color: 'red', mt: 2 }}>{error}</Typography>}
              </CardContent>
            </Card>
            <Card sx={{ maxWidth: 800, background: 'background.paper', border: '1px solid #00fff7', boxShadow: '0 0 16px #00fff733' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>Your Slots</Typography>
                <List>
                  {slots.length === 0 && <ListItem><ListItemText primary="No slots added yet." /></ListItem>}
                  {slots.map((slot) => (
                    <ListItem key={slot.id} secondaryAction={
                      <IconButton edge="end" color="error" onClick={() => removeSlot(slot.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }>
                      <ListItemText
                        primary={`${slot.title} - ${new Date(slot.startDateTime).toLocaleString()}`}
                        secondary={`Duration: ${slot.duration} min, Price: ₹${slot.price}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Availability;
