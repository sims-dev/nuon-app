import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Box, Typography, TextField, Button, Avatar, Grid, Card, CardContent } from '@mui/material';

const initialProfile = {
  name: 'John Doe',
  bio: 'Experienced mentor in technology and leadership.',
  specialty: 'Software Engineering',
  experience: 10,
  sessions: 120,
  price: 1500,
  rewardPoints: 300,
  avatar: '',
  contact: 'john.doe@email.com',
};

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      setProfile({ ...profile, avatar: url });
    }
  };

  const handleSave = () => {
    // Save logic here (API call in real app)
    alert('Profile saved!');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 5, background: '#101010', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
          Edit Profile
        </Typography>
        <Card sx={{ maxWidth: 600, background: 'background.paper', border: '1px solid #00fff7', boxShadow: '0 0 16px #00fff733' }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Avatar src={avatarUrl || profile.avatar} sx={{ width: 80, height: 80, margin: '0 auto', boxShadow: '0 0 12px #00fff7' }} />
                <Button variant="outlined" component="label" sx={{ mt: 2, color: 'primary.main', borderColor: 'primary.main' }}>
                  Upload Photo
                  <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Name" name="name" value={profile.name} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Specialty" name="specialty" value={profile.specialty} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Bio" name="bio" value={profile.bio} onChange={handleChange} fullWidth multiline minRows={2} variant="outlined" sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Experience (years)" name="experience" value={profile.experience} onChange={handleChange} type="number" fullWidth variant="outlined" sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Session Price (₹)" name="price" value={profile.price} onChange={handleChange} type="number" fullWidth variant="outlined" sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Total Sessions" name="sessions" value={profile.sessions} onChange={handleChange} type="number" fullWidth variant="outlined" sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Reward Points" name="rewardPoints" value={profile.rewardPoints} onChange={handleChange} type="number" fullWidth variant="outlined" sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Contact Email" name="contact" value={profile.contact} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button variant="contained" color="primary" size="large" onClick={handleSave} sx={{ mt: 2, px: 6, fontWeight: 'bold', boxShadow: '0 0 8px #00fff7' }}>
                  Save Profile
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Profile;
