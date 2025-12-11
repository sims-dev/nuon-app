import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import { Add, Edit, Delete, Person, School, AdminPanelSettings, CloudUpload } from '@mui/icons-material';
import axios from 'axios';
import MentorCredentialsDialog from './MentorCredentialsDialog';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const [newMentorData, setNewMentorData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'mentor',
    password: '',
    specialization: [],
    experience: '',
    qualification: '',
    department: '',
    hospital: '',
    bio: '',
    profileImage: null,
    profileImages: [],
    videos: [],
    hourlyRate: '',
    availability: 'available',
    location: '',
    city: '',
    state: '',
    linkedin: '',
    website: '',
    languages: ['English'],
    teachingStyle: '',
    preferredTopics: []
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('🔍 Debug - Loading users...');
      console.log('🔑 Token:', token ? 'Present' : 'Missing');
      
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📊 API Response:', response.data);
      
      // Handle API response format: { users, total, page, limit }
      if (response.data && response.data.users) {
        setUsers(response.data.users);
        console.log('✅ Users loaded:', response.data.users.length);
      } else {
        setUsers(response.data || []);
        console.log('✅ Users loaded (direct):', response.data?.length || 0);
      }
    } catch (error) {
      console.error('❌ Error loading users:', error);
      console.error('❌ Error details:', error.response?.data);
      setError('Failed to load users. Please check if you are logged in.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Debug - Creating/Updating user...');
      console.log('🔑 Token:', token ? 'Present' : 'Missing');
      console.log('📝 Form Data:', formData);

      // Generate random password if not provided
      const generatedPassword = formData.password || Math.random().toString(36).slice(-10);

      const submitData = new FormData();

      // Handle single profile image
      if (formData.profileImage) {
        submitData.append('profileImage', formData.profileImage);
      }

      // Handle multiple profile images
      formData.profileImages.forEach((file, index) => {
        submitData.append(`profileImages`, file);
      });

      // Handle videos
      formData.videos.forEach((file, index) => {
        submitData.append(`videos`, file);
      });

      // Handle other form data
      Object.keys(formData).forEach(key => {
        if (!['profileImage', 'profileImages', 'videos'].includes(key)) {
          if (Array.isArray(formData[key])) {
            submitData.append(key, JSON.stringify(formData[key]));
          } else {
            submitData.append(key, formData[key] || '');
          }
        }
      });
      submitData.append('password', generatedPassword);

      console.log('📤 Submit Data:', Object.fromEntries(submitData));

      const url = editingUser
        ? `${API_BASE_URL}/admin/users/${editingUser._id}`
        : `${API_BASE_URL}/admin/users`;

      const method = editingUser ? 'PUT' : 'POST';

      console.log(`🌐 API Call: ${method} ${url}`);

      const response = await axios({
        method,
        url,
        data: submitData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('✅ API Response:', response.data);

      // Show credentials for new mentor
      if (!editingUser && formData.role === 'mentor') {
        const mentorCredentials = {
          username: formData.username || formData.email,
          password: generatedPassword,
          email: formData.email,
          role: 'mentor'
        };
        
        setNewMentorData(mentorCredentials);
        setShowCredentials(true);
        setSuccess('Mentor created successfully! Please share the credentials with them.');
      } else {
        setSuccess(editingUser ? 'User updated successfully' : 'User created successfully');
      }
      
      setOpenDialog(false);
      resetForm();
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Failed to save user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: '',
      specialization: user.specialization || '',
      experience: user.experience || '',
      qualification: user.qualification || '',
      department: user.department || '',
      hospital: user.hospital || '',
      bio: user.bio || '',
      profileImage: null,
      hourlyRate: user.hourlyRate ? user.hourlyRate.replace('₹', '') : '',
      availability: user.availability || 'available'
    });
    setImagePreview(user.profilePicture ? `http://localhost:5000${user.profilePicture}` : null);
    setOpenDialog(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleImagesChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData({ ...formData, profileImages: [...formData.profileImages, ...files] });
  };

  const handleVideosChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData({ ...formData, videos: [...formData.videos, ...files] });
  };

  const removeImage = (index) => {
    const newImages = formData.profileImages.filter((_, i) => i !== index);
    setFormData({ ...formData, profileImages: newImages });
  };

  const removeVideo = (index) => {
    const newVideos = formData.videos.filter((_, i) => i !== index);
    setFormData({ ...formData, videos: newVideos });
  };

  const handleSpecializationChange = (value) => {
    const specs = value.split(',').map(s => s.trim()).filter(s => s);
    setFormData({ ...formData, specialization: specs });
  };

  const handleTopicsChange = (value) => {
    const topics = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData({ ...formData, preferredTopics: topics });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'mentor',
      password: '',
      specialization: '',
      experience: '',
      qualification: '',
      department: '',
      hospital: '',
      bio: '',
      profileImage: null,
      hourlyRate: '',
      availability: 'available'
    });
    setImagePreview(null);
    setEditingUser(null);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <AdminPanelSettings />;
      case 'mentor': return <School />;
      default: return <Person />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'mentor': return 'primary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              resetForm();
              setFormData(prev => ({ ...prev, role: 'mentor' }));
              setOpenDialog(true);
            }}
            sx={{ 
              backgroundColor: '#8B5CF6', 
              '&:hover': { backgroundColor: '#7C3AED' },
              mr: 1
            }}
          >
            Add Mentor
          </Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => {
              resetForm();
              setFormData(prev => ({ ...prev, role: 'nurse' }));
              setOpenDialog(true);
            }}
            sx={{ 
              borderColor: '#8B5CF6',
              color: '#8B5CF6',
              '&:hover': { borderColor: '#7C3AED', color: '#7C3AED' }
            }}
          >
            Add Nurse
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#F3F4F6' }}>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Specialization</strong></TableCell>
              <TableCell><strong>Department</strong></TableCell>
              <TableCell><strong>Experience</strong></TableCell>
              {users.some(user => user.role === 'mentor') && <TableCell><strong>Rate</strong></TableCell>}
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {getRoleIcon(user.role)}
                    <Box ml={1}>
                      <Typography variant="body1" fontWeight="medium">
                        {user.name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role?.toUpperCase()} 
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.specialization || '-'}</TableCell>
                <TableCell>{user.department || '-'}</TableCell>
                <TableCell>{user.experience || '-'}</TableCell>
                {users.some(u => u.role === 'mentor') && (
                  <TableCell>
                    {user.role === 'mentor' ? user.hourlyRate || '-' : '-'}
                  </TableCell>
                )}
                <TableCell>
                  <Chip 
                    label={user.availability || user.status || 'Active'} 
                    color={user.availability === 'available' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleEdit(user)}
                    color="primary"
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(user._id)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : `Add New ${formData.role === 'mentor' ? 'Mentor' : 'Nurse'}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              margin="normal"
              required
            />

            {/* Profile Image Upload */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Profile Image
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={imagePreview}
                  sx={{ width: 80, height: 80 }}
                >
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="profile-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      sx={{
                        borderColor: '#8B5CF6',
                        color: '#8B5CF6',
                        '&:hover': { borderColor: '#7C3AED', color: '#7C3AED' }
                      }}
                    >
                      Upload Image
                    </Button>
                  </label>
                  {formData.profileImage && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                      {formData.profileImage.name}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

              {/* Multiple Profile Images */}
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Additional Profile Images
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-images-upload"
                  type="file"
                  multiple
                  onChange={handleMultipleImagesChange}
                />
                <label htmlFor="profile-images-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    sx={{
                      borderColor: '#8B5CF6',
                      color: '#8B5CF6',
                      '&:hover': { borderColor: '#7C3AED', color: '#7C3AED' },
                      mr: 1
                    }}
                  >
                    Add Images
                  </Button>
                </label>
                {formData.profileImages.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.profileImages.map((file, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <Avatar
                          src={URL.createObjectURL(file)}
                          sx={{ width: 60, height: 60 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(index)}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: 'rgba(239, 68, 68, 0.8)',
                            '&:hover': { backgroundColor: 'rgba(239, 68, 68, 1)' }
                          }}
                        >
                          <Delete sx={{ fontSize: 16, color: 'white' }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              {/* Videos Upload */}
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Introduction Videos
                </Typography>
                <input
                  accept="video/*"
                  style={{ display: 'none' }}
                  id="videos-upload"
                  type="file"
                  multiple
                  onChange={handleVideosChange}
                />
                <label htmlFor="videos-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    sx={{
                      borderColor: '#8B5CF6',
                      color: '#8B5CF6',
                      '&:hover': { borderColor: '#7C3AED', color: '#7C3AED' }
                    }}
                  >
                    Add Videos
                  </Button>
                </label>
                {formData.videos.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {formData.videos.map((file, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {file.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeVideo(index)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="nurse">Nurse</MenuItem>
                <MenuItem value="mentor">Mentor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            
            {!editingUser && (
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                margin="normal"
                helperText="Leave empty to auto-generate a secure password"
              />
            )}
            
            <TextField
              fullWidth
              label="Specialization (comma-separated)"
              value={formData.specialization.join(', ')}
              onChange={(e) => handleSpecializationChange(e.target.value)}
              margin="normal"
              required
              placeholder="e.g., Critical Care Nursing, Emergency Medicine"
            />
            
            <TextField
              fullWidth
              label="Experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              margin="normal"
              required
              placeholder="e.g., 10 years"
            />

            {formData.role === 'mentor' && (
              <>
                <TextField
                  fullWidth
                  label="Qualification"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  margin="normal"
                  required
                  placeholder="e.g., PhD in Nursing, MD Emergency Medicine"
                />
                
                <TextField
                  fullWidth
                  label="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  margin="normal"
                  required
                  placeholder="e.g., ICU, Emergency, Cardiology"
                />
                
                <TextField
                  fullWidth
                  label="Hospital/Institution"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  margin="normal"
                  required
                  placeholder="e.g., Apollo Hospital, AIIMS Delhi"
                />
                
                <TextField
                  fullWidth
                  label="Hourly Rate (₹)"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  margin="normal"
                  required
                  placeholder="e.g., 2000"
                />
                
                <TextField
                  fullWidth
                  label="Bio/Description"
                  multiline
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  margin="normal"
                  placeholder="Brief description about the mentor's expertise and background"
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Availability Status</InputLabel>
                  <Select
                    value={formData.availability}
                    label="Availability Status"
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="busy">Busy</MenuItem>
                    <MenuItem value="offline">Offline</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  margin="normal"
                  placeholder="e.g., Mumbai, Maharashtra"
                />

                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  margin="normal"
                  placeholder="e.g., Mumbai"
                />

                <TextField
                  fullWidth
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  margin="normal"
                  placeholder="e.g., Maharashtra"
                />

                <TextField
                  fullWidth
                  label="LinkedIn Profile"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  margin="normal"
                  placeholder="https://linkedin.com/in/username"
                />

                <TextField
                  fullWidth
                  label="Website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  margin="normal"
                  placeholder="https://yourwebsite.com"
                />

                <TextField
                  fullWidth
                  label="Teaching Style"
                  value={formData.teachingStyle}
                  onChange={(e) => setFormData({ ...formData, teachingStyle: e.target.value })}
                  margin="normal"
                  placeholder="e.g., Interactive, Practical, Theory-focused"
                />

                <TextField
                  fullWidth
                  label="Preferred Topics (comma-separated)"
                  value={formData.preferredTopics.join(', ')}
                  onChange={(e) => handleTopicsChange(e.target.value)}
                  margin="normal"
                  placeholder="e.g., Emergency Care, Patient Management, ICU Procedures"
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: '#8B5CF6', '&:hover': { backgroundColor: '#7C3AED' } }}
          >
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mentor Credentials Dialog */}
      <MentorCredentialsDialog
        open={showCredentials}
        onClose={() => {
          setShowCredentials(false);
          setNewMentorData(null);
        }}
        credentials={newMentorData}
      />
    </Box>
  );
};

export default UserManagement;