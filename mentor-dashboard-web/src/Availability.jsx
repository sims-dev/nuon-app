import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Box, Typography, Button, Card, CardContent, Grid, TextField, IconButton, List, ListItem, ListItemText, Switch, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from './AuthContext';
import { IP_ADDRESS } from './config/ipConfig';

const Availability = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSlot, setNewSlot] = useState({ title: 'Mentorship Session', description: '', startDate: '', endDate: '', startTime: '', endTime: '', duration: 45, maxBookings: 1, price: 0, sessionType: 'mentoring', meetingType: 'zoom', specializations: [] });
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
    const { name, value } = e.target;
    let parsedValue = value;
    if (name === 'maxBookings' || name === 'duration') {
      parsedValue = parseInt(value, 10) || (name === 'maxBookings' ? 1 : 45);
    } else if (name === 'price') {
      parsedValue = parseFloat(value) || 0;
    }
    setNewSlot({ ...newSlot, [name]: parsedValue });
  };

  const addSlot = async () => {
    if (!newSlot.startDate || !newSlot.endDate || !newSlot.startTime || !newSlot.endTime) {
      setError('All date and time fields are required');
      return;
    }

    // Basic frontend validation
    const startDate = new Date(newSlot.startDate);
    const endDate = new Date(newSlot.endDate);
    const now = new Date();

    if (startDate > endDate) {
      setError('Start date must be before or equal to end date');
      return;
    }

    if (startDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      setError('Start date must be today or in the future');
      return;
    }

    // Parse times for validation
    const [startHour, startMinute] = newSlot.startTime.split(':').map(Number);
    const [endHour, endMinute] = newSlot.endTime.split(':').map(Number);

    if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
      setError('Start time must be before end time');
      return;
    }

    try {
      const slotData = {
        title: newSlot.title,
        description: newSlot.description,
        startDate: newSlot.startDate,
        endDate: newSlot.endDate,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        duration: newSlot.duration,
        maxBookings: newSlot.maxBookings,
        price: newSlot.price,
        sessionType: newSlot.sessionType,
        meetingType: newSlot.meetingType,
        specializations: newSlot.specializations
      };

      const res = await fetch(`${API_BASE}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(slotData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create availability slots');
      }

      const result = await res.json();
      fetchAvailability();
      setNewSlot({ title: 'Mentorship Session', description: '', startDate: '', endDate: '', startTime: '', endTime: '', duration: 45, maxBookings: 1, price: 0, sessionType: 'mentoring', meetingType: 'zoom', specializations: [] });
      setError('');
      alert(result.message || 'Availability slots created successfully');
    } catch (error) {
      setError(error.message || 'Failed to create availability slots');
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

  const toggleSlotActive = async (slotId, currentStatus) => {
    try {
      const res = await fetch(`${API_BASE}/availability/${slotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (!res.ok) throw new Error('Failed to update slot');
      fetchAvailability();
    } catch {
      setError('Failed to update slot status');
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
                      label="Start Date"
                      name="startDate"
                      type="date"
                      value={newSlot.startDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: new Date().toISOString().split('T')[0] }}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="End Date"
                      name="endDate"
                      type="date"
                      value={newSlot.endDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: newSlot.startDate || new Date().toISOString().split('T')[0] }}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Start Time"
                      name="startTime"
                      type="time"
                      value={newSlot.startTime}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="End Time"
                      name="endTime"
                      type="time"
                      value={newSlot.endTime}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
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
                  {slots
                    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
                    .map((slot) => (
                    <ListItem key={slot.id} secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          color={slot.isActive ? "success" : "warning"}
                          onClick={() => toggleSlotActive(slot.id, slot.isActive)}
                        >
                          {slot.isActive ? 'Active' : 'Inactive'}
                        </Button>
                        <IconButton edge="end" color="error" onClick={() => removeSlot(slot.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }>
                      <ListItemText
                        primary={`${slot.title} - ${new Date(slot.startDateTime).toLocaleDateString()}`}
                        secondary={`Time: ${new Date(slot.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(slot.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, Duration: ${slot.duration} min, Price: ₹${slot.price || 0}, Bookings: ${slot.currentBookings}/${slot.maxBookings}`}
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
