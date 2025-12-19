import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
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
  Grid,
  LinearProgress,
  FormControlLabel,
  
  Switch
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Upload,
  CloudUpload,
  PlayArrow,
  Close
} from '@mui/icons-material';
import api from '../../services/api';


const EngageActivityManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  
  const activityTypes = {
    wellness: ['Yoga', 'Meditation', 'Stress Management', 'Mental Health'],
    fitness: ['Gym Session', 'Strength Training', 'Cardio', 'Sports'],
    event: ['Workshop', 'Seminar', 'Conference', 'Meetup']
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'wellness',
    type: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    price: 0,
    points: 100,
    capacity: 50,
    instructorName: '',
    instructorId: '',
    image: null,
    imageName: '',
    thumbnail: null,
    thumbnailName: '',
    videoUrl: '',
    videoFile: null,
    videoFileName: '',
    videoTitle: '',
    videoDuration: 0,
    videoQuality: 'auto,720p,480p,360p',
    videoThumbnail: null,
    videoThumbnailName: '',
    tags: '',
    isActive: true,
    status: 'active'
  });

  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const category = ['wellness', 'fitness', 'event'][tabValue];

      const response = await api.get(
        `/admin/engage/activities?category=${category}&page=1&limit=100`
      );

      setActivities(response.data.data || []);
      setError('');
    } catch (err) {
      console.error('Error loading activities:', err);
      setError(err.response?.data?.message || 'Failed to load activities');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setEditingItem(null);
    loadActivities();
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || '',
        description: item.description || '',
        category: item.category || 'wellness',
        type: item.type || '',
        date: item.date ? item.date.split('T')[0] : '',
        time: item.time || '',
        duration: item.duration || '',
        location: item.location || '',
        price: item.price || 0,
        points: item.points || 100,
        capacity: item.capacity || 50,
        instructorName: item.instructorName || '',
        instructorId: item.instructorId || '',
        imageName: item.image ? item.image.split('/').pop() : '',
        thumbnailName: item.thumbnail ? item.thumbnail.split('/').pop() : '',
        videoUrl: item.videoUrl || '',
        videoFileName: item.videoUrl ? item.videoUrl.split('/').pop() : '',
        videoTitle: item.videoTitle || '',
        videoDuration: item.videoDuration || 0,
        videoQuality: item.videoQuality || 'auto,720p,480p,360p',
        videoThumbnailName: item.videoThumbnail ? item.videoThumbnail.split('/').pop() : '',
        tags: item.tags ? (typeof item.tags === 'string' ? item.tags : item.tags.join(', ')) : '',
        isActive: item.isActive !== false,
        status: item.status || 'active'
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        category: ['wellness', 'fitness', 'event'][tabValue],
        type: '',
        date: '',
        time: '',
        duration: '',
        location: '',
        price: 0,
        points: 100,
        capacity: 50,
        instructorName: '',
        instructorId: '',
        image: null,
        imageName: '',
        thumbnail: null,
        thumbnailName: '',
        videoUrl: '',
        videoFile: null,
        videoFileName: '',
        videoTitle: '',
        videoDuration: 0,
        videoQuality: 'auto,720p,480p,360p',
        videoThumbnail: null,
        videoThumbnailName: '',
        tags: '',
        isActive: true,
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setUploadProgress(0);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0],
        [`${name}Name`]: files[0].name
      }));
    }
  };

  const handleSaveActivity = async () => {
    try {
      setLoading(true);

      const formDataToSend = new FormData();
      
      // Add all text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('points', parseInt(formData.points));
      formDataToSend.append('capacity', parseInt(formData.capacity));
      formDataToSend.append('instructorName', formData.instructorName);
      formDataToSend.append('instructorId', formData.instructorId);
      formDataToSend.append('videoTitle', formData.videoTitle);
      formDataToSend.append('videoQuality', formData.videoQuality);
      formDataToSend.append('videoDuration', parseInt(formData.videoDuration));
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('status', formData.status);

      // Add files if they exist
      if (formData.image) formDataToSend.append('image', formData.image);
      if (formData.thumbnail) formDataToSend.append('thumbnail', formData.thumbnail);
      if (formData.videoFile) formDataToSend.append('videoFile', formData.videoFile);
      if (formData.videoThumbnail) formDataToSend.append('videoThumbnail', formData.videoThumbnail);

      if (editingItem) {
        await api.put(
          `/admin/engage/activities/${editingItem.id}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            }
          }
        );
      } else {
        await api.post(
          `/admin/engage/activities`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            }
          }
        );
      }

      setSuccess(`Activity ${editingItem ? 'updated' : 'created'} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
      
      handleCloseDialog();
      await loadActivities();
    } catch (err) {
      console.error('Error saving activity:', err);
      setError(err.response?.data?.message || 'Failed to save activity');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      setLoading(true);

      await api.delete(
        `/admin/engage/activities/${id}`
      );

      setSuccess('Activity deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await loadActivities();
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError(err.response?.data?.message || 'Failed to delete activity');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (item) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  const currentCategory = ['wellness', 'fitness', 'event'][tabValue];

  return (
    <Box sx={{ width: '100%' }}>
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Manage Engage Activities</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          color="primary"
        >
          Add Activity
        </Button>
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="🧘 Wellness" />
          <Tab label="💪 Fitness" />
          <Tab label="🎉 Events" />
        </Tabs>
      </Paper>

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Capacity</strong></TableCell>
              <TableCell><strong>Registered</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">No activities found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity.id} hover>
                  <TableCell>{activity.title}</TableCell>
                  <TableCell>{activity.type || '-'}</TableCell>
                  <TableCell>
                    {activity.date ? new Date(activity.date).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>${activity.price || 0}</TableCell>
                  <TableCell>{activity.capacity || 0}</TableCell>
                  <TableCell>{activity.registeredCount || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={activity.status}
                      color={activity.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {activity.videoUrl && (
                      <IconButton
                        size="small"
                        onClick={() => handlePreview(activity)}
                        title="Preview Video"
                      >
                        <PlayArrow fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(activity)}
                      title="Edit"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteActivity(activity.id)}
                      title="Delete"
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? `Edit ${currentCategory} Activity` : `Create ${currentCategory} Activity`}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Activity Title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="e.g., Morning Yoga Session"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={3}
                placeholder="Detailed description of the activity"
              />
            </Grid>

            {/* Category and Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  label="Type"
                >
                  {activityTypes[formData.category]?.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instructor Name"
                name="instructorName"
                value={formData.instructorName}
                onChange={handleFormChange}
              />
            </Grid>

            {/* Date and Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                name="time"
                value={formData.time}
                onChange={handleFormChange}
                placeholder="e.g., 3:00 PM - 5:00 PM"
              />
            </Grid>

            {/* Duration and Location */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                name="duration"
                value={formData.duration}
                onChange={handleFormChange}
                placeholder="e.g., 2 weeks, 6 hours"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="e.g., Online, Studio A"
              />
            </Grid>

            {/* Pricing */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price ($)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleFormChange}
                inputProps={{ step: '0.01', min: '0' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Points"
                name="points"
                type="number"
                value={formData.points}
                onChange={handleFormChange}
                inputProps={{ min: '0' }}
              />
            </Grid>

            {/* Capacity */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleFormChange}
                inputProps={{ min: '1' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Tags */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleFormChange}
                placeholder="Comma separated tags"
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>📷 Activity Image</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  name="image"
                  id="image-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Upload />}
                  >
                    Choose Image
                  </Button>
                </label>
                {formData.imageName && (
                  <Chip label={formData.imageName} onDelete={() => setFormData(prev => ({
                    ...prev, image: null, imageName: ''
                  }))} />
                )}
              </Box>
            </Grid>

            {/* Thumbnail Upload */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>🎬 Thumbnail</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  name="thumbnail"
                  id="thumbnail-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="thumbnail-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Upload />}
                  >
                    Choose Thumbnail
                  </Button>
                </label>
                {formData.thumbnailName && (
                  <Chip label={formData.thumbnailName} onDelete={() => setFormData(prev => ({
                    ...prev, thumbnail: null, thumbnailName: ''
                  }))} />
                )}
              </Box>
            </Grid>

            {/* Video Content Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>🎥 Video Content</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Video Title"
                name="videoTitle"
                value={formData.videoTitle}
                onChange={handleFormChange}
                placeholder="Title displayed on video player"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Video Duration (seconds)"
                name="videoDuration"
                type="number"
                value={formData.videoDuration}
                onChange={handleFormChange}
                inputProps={{ min: '0' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Video Quality</InputLabel>
                <Select
                  name="videoQuality"
                  value={formData.videoQuality}
                  onChange={handleFormChange}
                  label="Video Quality"
                >
                  <MenuItem value="auto">Auto Only</MenuItem>
                  <MenuItem value="auto,720p">Auto, 720p</MenuItem>
                  <MenuItem value="auto,720p,480p">Auto, 720p, 480p</MenuItem>
                  <MenuItem value="auto,720p,480p,360p">Auto, 720p, 480p, 360p</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Video File Upload */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>📹 Upload Video File</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  name="videoFile"
                  id="video-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="video-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                  >
                    Choose Video
                  </Button>
                </label>
                {formData.videoFileName && (
                  <Chip 
                    label={formData.videoFileName} 
                    onDelete={() => setFormData(prev => ({
                      ...prev, videoFile: null, videoFileName: ''
                    }))} 
                  />
                )}
              </Box>
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'gray' }}>
                Max 500MB, Supported: MP4, WebM, Ogg
              </Typography>
            </Grid>

            {/* Video Thumbnail Upload */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>🎬 Video Thumbnail</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  name="videoThumbnail"
                  id="video-thumbnail-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="video-thumbnail-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Upload />}
                  >
                    Choose Video Thumbnail
                  </Button>
                </label>
                {formData.videoThumbnailName && (
                  <Chip label={formData.videoThumbnailName} onDelete={() => setFormData(prev => ({
                    ...prev, videoThumbnail: null, videoThumbnailName: ''
                  }))} />
                )}
              </Box>
            </Grid>

            {/* Active Status */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({
                      ...prev, isActive: e.target.checked
                    }))}
                  />
                }
                label="Activity is Active"
              />
            </Grid>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} sx={{ flex: 1 }} />
                  <Typography variant="body2">{uploadProgress}%</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveActivity} 
            variant="contained" 
            disabled={loading || !formData.title}
          >
            {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Video Preview - {previewItem?.videoTitle || 'Activity Video'}
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {previewItem?.videoUrl && (
            <video
              width="100%"
              height="auto"
              controls
              poster={previewItem?.videoThumbnail}
              style={{ borderRadius: 4 }}
            >
              <source src={previewItem.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {previewItem && (
            <Box sx={{ mt: 2 }}>
              <Typography><strong>Title:</strong> {previewItem.title}</Typography>
              <Typography><strong>Type:</strong> {previewItem.type}</Typography>
              <Typography><strong>Duration:</strong> {previewItem.videoDuration} seconds</Typography>
              <Typography><strong>Quality:</strong> {previewItem.videoQuality}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EngageActivityManagement;
