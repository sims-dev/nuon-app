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
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Person, School, AdminPanelSettings } from '@mui/icons-material';
import api from '../../services/api';
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
  const [formData, setFormData] = useState({
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


  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Debug - Loading users...');

      const response = await api.get('/admin/users');
      
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
      console.log('🔍 Debug - Creating/Updating user...');
      console.log('📝 Form Data:', formData);

      // Generate random password if not provided
      const generatedPassword = formData.password || Math.random().toString(36).slice(-10);

      const submitData = {
        ...formData,
        password: generatedPassword
      };

      console.log('📤 Submit Data:', submitData);

      const url = editingUser
        ? `/admin/users/${editingUser._id}`
        : `/admin/users`;

      const method = editingUser ? 'put' : 'post';

      console.log(`🌐 API Call: ${method} ${url}`);

      const response = await api[method](url, submitData);

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
      await api.delete(`/admin/users/${userId}`);
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
      phone: user.phoneNumber || user.phone,
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
    setOpenDialog(true);
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
              <TableCell><strong>Rate</strong></TableCell>
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
                <TableCell>{user.phoneNumber || user.phone}</TableCell>
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
                <TableCell>
                  {user.role === 'mentor' ? user.hourlyRate || '-' : '-'}
                </TableCell>
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
              label="Specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
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