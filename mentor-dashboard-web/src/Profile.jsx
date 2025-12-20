import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Box, Typography, TextField, Button, Avatar, Grid, Card, CardContent } from '@mui/material';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    specialization: '',
    experience: '',
    currentWorkplace: '',
    city: '',
    state: '',
    registrationNumber: '',
    highestQualification: '',
    bio: '',
    organization: '',
    profilePicture: '',
    phoneNumber: '',
    role: '',
    hourlyRate: '',
    qualification: '',
    department: '',
    hospital: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState(null);

  // Fetch profile from backend
  const fetchProfile = () => {
    setLoading(true);
    const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api') + '/mentors/mentor';
    fetch(`${API_BASE}/profile`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProfile({
          name: data.name || '',
          email: data.email || '',
          specialization: data.specialization || '',
          experience: data.experience || '',
          currentWorkplace: data.currentWorkplace || '',
          city: data.city || '',
          state: data.state || '',
          registrationNumber: data.registrationNumber || '',
          highestQualification: data.highestQualification || '',
          bio: data.bio || '',
          organization: data.organization || '',
          profilePicture: data.profilePicture || '',
          phoneNumber: data.phoneNumber || '',
          role: data.role || '',
          hourlyRate: data.hourlyRate || '',
          qualification: data.qualification || '',
          department: data.department || '',
          hospital: data.hospital || ''
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        setLoading(false);
      });
  };

  useEffect(() => { fetchProfile(); }, []);

  // Handle form input
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Save profile to backend
  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      let pictureUrl = profile.profilePicture;
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'}/upload/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: formData
        });
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        const uploadData = await uploadRes.json();
        pictureUrl = uploadData.url || pictureUrl;
      }
      const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api') + '/mentors/mentor';
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ ...profile, profilePicture: pictureUrl })
      });
      if (!res.ok) throw new Error('Failed to save profile');
      fetchProfile();
      setSuccess('Profile updated successfully!');
    } catch {
      setError('Failed to save profile');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 5, background: '#101010', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
          Edit Profile
        </Typography>
        {loading ? <Typography sx={{ color: '#fff' }}>Loading...</Typography> : (
          <Card sx={{ maxWidth: 800, background: 'background.paper', border: '1px solid #00fff7', boxShadow: '0 0 16px #00fff733' }}>
            <CardContent>
              <form onSubmit={handleSave}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Avatar src={profile.profilePicture} sx={{ width: 80, height: 80, margin: '0 auto', boxShadow: '0 0 12px #00fff7' }} />
                    <Button variant="outlined" component="label" sx={{ mt: 2, color: 'primary.main', borderColor: 'primary.main' }}>
                      Upload Photo
                      <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Name" name="name" value={profile.name} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Email" name="email" value={profile.email} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Specialization" name="specialization" value={profile.specialization} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Experience (years)" name="experience" value={profile.experience} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Current Workplace" name="currentWorkplace" value={profile.currentWorkplace} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="City" name="city" value={profile.city} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="State" name="state" value={profile.state} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Registration Number" name="registrationNumber" value={profile.registrationNumber} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Highest Qualification" name="highestQualification" value={profile.highestQualification} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Organization" name="organization" value={profile.organization} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Phone Number" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Hourly Rate (₹)" name="hourlyRate" value={profile.hourlyRate} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Qualification" name="qualification" value={profile.qualification} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Department" name="department" value={profile.department} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Hospital" name="hospital" value={profile.hospital} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Bio" name="bio" value={profile.bio} onChange={handleChange} fullWidth multiline minRows={2} variant="outlined" sx={{ mb: 2 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Role" name="role" value={profile.role} onChange={handleChange} fullWidth variant="outlined" sx={{ mb: 2 }} disabled />
                  </Grid>
                  {error && <Grid item xs={12}><Typography sx={{ color: 'red' }}>{error}</Typography></Grid>}
                  {success && <Grid item xs={12}><Typography sx={{ color: 'green' }}>{success}</Typography></Grid>}
                  <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2, px: 6, fontWeight: 'bold', boxShadow: '0 0 8px #00fff7' }}>
                      Save Profile
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Profile;