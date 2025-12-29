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
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  VideoLibrary,
  School,
  Event,
  Upload,
  CloudUpload,
  Visibility,
  Article
} from '@mui/icons-material';
import api from '../../services/api';

const ContentManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [contentType, setContentType] = useState('course');
  const [editingItem, setEditingItem] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'general',
    featured: false,
    videoFile: null,
    imageFile: null,
    tags: '',
    price: '',
    duration: '',
    level: 'beginner',
    materials: '',
    date: '',
    time: '',
    instructor: '',
    venue: '',
    maxParticipants: '',
    prerequisites: '',
    points: '',
    enrolled: '',
    modules: '',
    certificate: false,
    seats: '',
    speakers: ''
  });


  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);

      console.log('🔍 Loading content...');

      // Load courses, events, workshops, and news using the correct existing endpoints
      const [coursesRes, eventsRes, workshopsRes, newsRes] = await Promise.allSettled([
        api.get('/courses'),
        api.get('/events'),
        api.get('/admin/content/workshops'),
        api.get('/news')
      ]);

      console.log('📚 Courses response:', coursesRes);
      console.log('🎯 Events response:', eventsRes);
      console.log('🛠️ Workshops response:', workshopsRes);
      console.log('📰 News response:', newsRes);

      // Handle courses response
      if (coursesRes.status === 'fulfilled' && coursesRes.value.data) {
        const coursesData = coursesRes.value.data.success ?
          coursesRes.value.data.courses :
          coursesRes.value.data;
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        console.log('✅ Courses loaded:', coursesData?.length || 0);
      } else {
        setCourses([]);
        console.log('❌ Failed to load courses');
      }

      // Handle events response
      if (eventsRes.status === 'fulfilled' && eventsRes.value.data) {
        const eventsData = Array.isArray(eventsRes.value.data) ?
          eventsRes.value.data :
          eventsRes.value.data.events || [];
        setEvents(eventsData);
        console.log('✅ Events loaded:', eventsData.length);
      } else {
        setEvents([]);
        console.log('❌ Failed to load events');
      }

      // Handle workshops response
      if (workshopsRes.status === 'fulfilled' && workshopsRes.value.data) {
        const workshopsData = Array.isArray(workshopsRes.value.data) ?
          workshopsRes.value.data :
          workshopsRes.value.data.workshops || [];
        setWorkshops(workshopsData);
        console.log('✅ Workshops loaded:', workshopsData.length);
      } else {
        setWorkshops([]);
        console.log('❌ Failed to load workshops');
      }

      // Handle news response
      if (newsRes.status === 'fulfilled' && newsRes.value.data) {
        const newsData = newsRes.value.data.success ?
          newsRes.value.data.news :
          newsRes.value.data;
        setNews(Array.isArray(newsData) ? newsData : []);
        console.log('✅ News loaded:', newsData?.length || 0);
        console.log('📰 News data:', newsData);
      } else {
        setNews([]);
        console.log('❌ Failed to load news');
        console.log('❌ News response:', newsRes);
      }

    } catch (error) {
      console.error('❌ Error loading content:', error);
      setError('Failed to load content');

      // Set empty arrays to avoid UI errors
      setCourses([]);
      setEvents([]);
      setWorkshops([]);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file, type) => {
    const formData = new FormData();
    formData.append(type, file);

    try {
      console.log('🔍 Debug - Uploading file...');
      console.log('📁 File:', file.name, 'Type:', type);
      
      // Use the configured API service with auth interceptor
      const response = await api.post(`/upload/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
          console.log(`📊 Upload progress: ${progress}%`);
        },
        timeout: 300000 // 5 minutes timeout for large files
      });
      
      console.log('✅ File uploaded:', response.data);
      return response.data.url;
    } catch (error) {
      console.error('❌ Upload error:', error);
      console.error('❌ Upload error details:', error.response?.data);
      
      // Handle specific error types
      let errorMessage = 'Failed to upload file';
      if (error.response?.status === 413 || error.message.includes('File too large')) {
        errorMessage = 'File is too large. Please use a file smaller than 1GB.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid file type. Please upload videos (MP4, AVI, MOV, etc.) or images (JPG, PNG, GIF, WebP).';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please try logging in again.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timed out. Please try again with a smaller file or check your connection.';
      }
      
      throw new Error(errorMessage);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      console.log('🔍 Creating/updating content...');
      console.log('📝 Form Data:', formData);

      let submitData = { ...formData };
      let images = [];
      let videos = [];

      // Upload files if present
      if (formData.videoFile) {
        console.log('📹 Uploading video...');
        const videoUrl = await handleFileUpload(formData.videoFile, 'video');
        videos.push({
          url: videoUrl,
          thumbnail: formData.imageFile ? await handleFileUpload(formData.imageFile, 'image') : '',
          title: formData.title,
          duration: '00:00'
        });
      }

      if (formData.imageFile) {
        console.log('🖼️ Uploading image...');
        const imageUrl = await handleFileUpload(formData.imageFile, 'image');
        images.push({
          url: imageUrl,
          alt: formData.title,
          caption: formData.excerpt || ''
        });
      }

      // Remove file objects from submit data
      delete submitData.videoFile;
      delete submitData.imageFile;

      // Map form data to backend expected format
      if (contentType === 'news') {
        submitData = {
          title: submitData.title,
          content: submitData.content,
          excerpt: submitData.excerpt,
          category: submitData.category,
          featured: submitData.featured,
          images: images,
          videos: videos,
          tags: submitData.tags ? submitData.tags.split(',').map(tag => tag.trim()) : [],
          type: videos.length > 0 ? 'video' : 'article'
        };
      } else if (contentType === 'course') {
        submitData = {
          title: submitData.title,
          description: submitData.content || submitData.description,
          price: parseFloat(submitData.price) || 0,
          thumbnail: images[0]?.url || '', // optional image
          instructor: submitData.instructor || '',
          points: parseInt(submitData.points) || 0,
          enrolled: parseInt(submitData.enrolled) || 0,
          category: submitData.category || 'General',
          level: submitData.level || 'beginner',
          modules: parseInt(submitData.modules) || 0,
          certificate: submitData.certificate || false,
          duration: submitData.duration || '',
          date: submitData.date ? new Date(submitData.date) : null,
          lessons: videos.length > 0 ? [{
            title: submitData.title + ' - Lesson 1',
            videoUrl: videos[0].url, // can be public, local, or external
            thumbnail: videos[0].thumbnail || images[0]?.url || '', // optional image
            duration: 1800,
            order: 1
          }] : []
        };
      } else if (contentType === 'workshop') {
        // Generate slug from title for workshops
        const slug = submitData.title.toLowerCase()
          .replace(/[^a-z0-9 -]/g, '') // Remove special characters
          .replace(/\s+/g, '-')        // Replace spaces with hyphens
          .replace(/-+/g, '-')         // Replace multiple hyphens with single
          .trim();

        submitData = {
          title: submitData.title,
          slug: slug,
          description: submitData.content || submitData.description,
          coverImage: images[0]?.url || '',
          isPublished: true,
          startDate: submitData.date ? new Date(submitData.date) : new Date(),
          endDate: submitData.date ? new Date(new Date(submitData.date).getTime() + (parseInt(submitData.duration) || 1) * 60 * 60 * 1000) : new Date(),
          tags: submitData.category ? [submitData.category] : [],
          instructor: submitData.instructor || '',
          type: submitData.type || 'Workshop',
          date: submitData.date,
          time: submitData.time,
          location: submitData.venue,
          price: parseFloat(submitData.price) || 0,
          points: parseInt(submitData.points) || 0,
          enrolled: parseInt(submitData.enrolled) || 0,
          seats: parseInt(submitData.seats) || 0,
          category: submitData.category || 'General',
          duration: submitData.duration,
          materials: submitData.materials || '',
          image: images[0]?.url || '',
          metadata: {
            price: parseFloat(submitData.price) || 0,
            duration: submitData.duration,
            venue: submitData.venue,
            maxParticipants: parseInt(submitData.maxParticipants) || 50,
            instructor: submitData.instructor,
            videoUrl: videos[0]?.url || ''
          }
        };
      } else if (contentType === 'event') {
        submitData = {
          title: submitData.title,
          description: submitData.content || submitData.description,
          price: parseFloat(submitData.price) || 0,
          date: submitData.date,
          time: submitData.time,
          location: submitData.venue,
          points: parseInt(submitData.points) || 0,
          seats: parseInt(submitData.seats) || 0,
          category: submitData.category || 'General',
          speakers: submitData.speakers || '',
          type: submitData.type || 'Event',
          image: images[0]?.url || '',
          maxParticipants: parseInt(submitData.maxParticipants) || 100,
          instructor: submitData.instructor
        };
      }

      const endpoint = contentType === 'news' ? 'news' :
                      contentType === 'course' ? 'courses' :
                      contentType === 'event' ? 'events' : 'admin/content/workshops';

      const url = editingItem
        ? `/${endpoint}/${editingItem._id}`
        : `/${endpoint}`;

      const method = editingItem ? 'put' : 'post';

      console.log(`🌐 API Call: ${method} ${url}`);
      console.log('📤 Submit Data:', submitData);

      const response = await api[method](url, submitData);

      console.log('✅ Content saved:', response.data);
      setSuccess(`${contentType} ${editingItem ? 'updated' : 'created'} successfully`);
      setOpenDialog(false);
      resetForm();
      loadContent();
    } catch (error) {
      console.error('❌ Error saving content:', error);
      console.error('❌ Error details:', error.response?.data);
      setError(`Failed to save ${contentType}: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id, type) => {
    if (!id) {
      console.error('No ID provided for delete');
      setError('Invalid item selected for deletion');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const endpoint = type === 'news' ? 'news' :
                        type === 'course' ? 'courses' :
                        type === 'event' ? 'events' : 'admin/content/workshops';

      console.log('🔍 Debug - Deleting content...');
      console.log('🗑️ Type:', type, 'ID:', id);

      await api.delete(`/${endpoint}/${id}`);

      setSuccess(`${type} deleted successfully`);
      loadContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      setError(`Failed to delete ${type}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'general',
      featured: false,
      videoFile: null,
      imageFile: null,
      tags: '',
      price: '',
      duration: '',
      level: 'beginner',
      materials: '',
      date: '',
      time: '',
      instructor: '',
      venue: '',
      maxParticipants: '',
      prerequisites: '',
      points: '',
      enrolled: '',
      modules: '',
      certificate: false,
      seats: '',
      speakers: ''
    });
    setEditingItem(null);
  };

  const openCreateDialog = (type) => {
    setContentType(type);
    resetForm();
    setOpenDialog(true);
  };

  const renderContentTable = (data, type) => {
    // Ensure data is an array
    const safeData = Array.isArray(data) ? data : [];

    return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: '#F3F4F6' }}>
          <TableRow>
            <TableCell><strong>Title</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            {type === 'news' && <TableCell><strong>Category</strong></TableCell>}
            {type !== 'news' && <TableCell><strong>Price</strong></TableCell>}
            <TableCell><strong>Status</strong></TableCell>
            {type === 'news' && <TableCell><strong>Views</strong></TableCell>}
            {type === 'course' && <TableCell><strong>Enrolled</strong></TableCell>}
            {(type === 'event' || type === 'workshop') && <TableCell><strong>Date</strong></TableCell>}
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {safeData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={type === 'news' ? 6 : 6} align="center">
                <Typography variant="body2" color="text.secondary">
                  No {type}s found. Create one to get started!
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            safeData.map((item) => (
            <TableRow key={item._id} hover>
              <TableCell>
                <Typography variant="body1" fontWeight="medium">
                  {item.title}
                </Typography>
                {item.featured && <Chip label="Featured" size="small" color="primary" sx={{ ml: 1 }} />}
              </TableCell>
              <TableCell>
                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                  {type === 'news' ? item.excerpt : item.description}
                </Typography>
              </TableCell>
              {type === 'news' && (
                <TableCell>
                  <Chip label={item.category} size="small" />
                </TableCell>
              )}
              {type !== 'news' && (
                <TableCell>₹{item.price}</TableCell>
              )}
              <TableCell>
                <Chip
                  label={item.status || 'draft'}
                  color={item.status === 'published' || item.status === 'upcoming' ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              {type === 'news' && (
                <TableCell>{item.viewCount || 0}</TableCell>
              )}
              {type === 'course' && (
                <TableCell>{item.enrolledCount || 0}</TableCell>
              )}
              {(type === 'event' || type === 'workshop') && (
                <TableCell>{new Date(item.date || item.startDate).toLocaleDateString()}</TableCell>
              )}
              <TableCell>
                <IconButton color="primary" size="small">
                  <Visibility />
                </IconButton>
                <IconButton color="primary" size="small">
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDelete(item._id, type)}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          )))}
        </TableBody>
      </Table>
    </TableContainer>
    );
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" mb={3}>
        Content Management
      </Typography>

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

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="News" icon={<Article />} />
          <Tab label="Courses" icon={<School />} />
          <Tab label="Events" icon={<Event />} />
          <Tab label="Workshops" icon={<VideoLibrary />} />
        </Tabs>
      </Box>

      {/* News Tab */}
      {tabValue === 0 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">News & Announcements</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openCreateDialog('news')}
              sx={{ backgroundColor: '#8B5CF6', '&:hover': { backgroundColor: '#7C3AED' } }}
            >
              Add News
            </Button>
          </Box>
          {renderContentTable(news, 'news')}
        </Box>
      )}

      {/* Courses Tab */}
      {tabValue === 1 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Courses</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openCreateDialog('course')}
              sx={{ backgroundColor: '#8B5CF6', '&:hover': { backgroundColor: '#7C3AED' } }}
            >
              Add Course
            </Button>
          </Box>
          {renderContentTable(courses, 'course')}
        </Box>
      )}

      {/* Events Tab */}
      {tabValue === 2 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Events</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openCreateDialog('event')}
              sx={{ backgroundColor: '#8B5CF6', '&:hover': { backgroundColor: '#7C3AED' } }}
            >
              Add Event
            </Button>
          </Box>
          {renderContentTable(events, 'event')}
        </Box>
      )}

      {/* Workshops Tab */}
      {tabValue === 3 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Workshops</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openCreateDialog('workshop')}
              sx={{ backgroundColor: '#8B5CF6', '&:hover': { backgroundColor: '#7C3AED' } }}
            >
              Add Workshop
            </Button>
          </Box>
          {renderContentTable(workshops, 'workshop')}
        </Box>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? `Edit ${contentType}` : `Create New ${contentType}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
            />

            {contentType === 'news' ? (
              <>
                <TextField
                  fullWidth
                  label="Content"
                  multiline
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  margin="normal"
                  placeholder="Enter rich content with HTML support"
                />

                <TextField
                  fullWidth
                  label="Excerpt"
                  multiline
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  margin="normal"
                  placeholder="Brief summary (300 characters max)"
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <MenuItem value="announcement">Announcement</MenuItem>
                    <MenuItem value="update">Update</MenuItem>
                    <MenuItem value="event">Event</MenuItem>
                    <MenuItem value="achievement">Achievement</MenuItem>
                    <MenuItem value="general">General</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                  }
                  label="Featured News"
                />

                <TextField
                  fullWidth
                  label="Tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  margin="normal"
                  placeholder="Enter tags separated by commas"
                />
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Price (₹)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  margin="normal"
                />

                {contentType === 'course' && (
                  <>
                    <TextField
                      fullWidth
                      label="Duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      margin="normal"
                      placeholder="e.g., 6 weeks, 40 hours"
                    />

                    <TextField
                      fullWidth
                      label="Date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />

                    <FormControl fullWidth margin="normal">
                      <InputLabel>Level</InputLabel>
                      <Select
                        value={formData.level}
                        label="Level"
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      >
                        <MenuItem value="beginner">Beginner</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="advanced">Advanced</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      margin="normal"
                    />

                    <TextField
                      fullWidth
                      label="Instructor"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      margin="normal"
                    />

                    <TextField
                      fullWidth
                      label="Points"
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                      margin="normal"
                    />

                    <TextField
                      fullWidth
                      label="Enrolled Count"
                      type="number"
                      value={formData.enrolled}
                      onChange={(e) => setFormData({ ...formData, enrolled: e.target.value })}
                      margin="normal"
                    />

                    <TextField
                      fullWidth
                      label="Modules Count"
                      type="number"
                      value={formData.modules}
                      onChange={(e) => setFormData({ ...formData, modules: e.target.value })}
                      margin="normal"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.certificate}
                          onChange={(e) => setFormData({ ...formData, certificate: e.target.checked })}
                        />
                      }
                      label="Certificate Available"
                    />
                  </>
                )}

                {(contentType === 'event' || contentType === 'workshop') && (
                  <>
                    <TextField
                      fullWidth
                      label="Date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                      fullWidth
                      label="Time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                      fullWidth
                      label="Duration (hours)"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      margin="normal"
                      placeholder="e.g., 2, 4, 8"
                    />

                    <TextField
                      fullWidth
                      label="Instructor ID"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      margin="normal"
                      placeholder="Enter instructor's user ID"
                    />

                    <TextField
                      fullWidth
                      label="Venue"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      margin="normal"
                    />

                    <TextField
                      fullWidth
                      label="Max Participants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                      margin="normal"
                    />

                    <TextField
                      fullWidth
                      label="Points"
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                      margin="normal"
                    />

                    <TextField
                      fullWidth
                      label="Seats Available"
                      type="number"
                      value={formData.seats}
                      onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                      margin="normal"
                    />

                    <TextField
                      fullWidth
                      label="Speakers"
                      value={formData.speakers}
                      onChange={(e) => setFormData({ ...formData, speakers: e.target.value })}
                      margin="normal"
                      placeholder="e.g., Dr. Sharma & Team"
                    />
                  </>
                )}

                {contentType === 'workshop' && (
                  <>
                    <TextField
                      fullWidth
                      label="Enrolled Count"
                      type="number"
                      value={formData.enrolled}
                      onChange={(e) => setFormData({ ...formData, enrolled: e.target.value })}
                      margin="normal"
                    />

                    <TextField
                      fullWidth
                      label="Seats Available"
                      type="number"
                      value={formData.seats}
                      onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                      margin="normal"
                    />

                    <TextField
                      fullWidth
                      label="Materials"
                      value={formData.materials}
                      onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                      margin="normal"
                      placeholder="e.g., Provided, Digital Resources"
                    />
                  </>
                )}
              </>
            )}

            {/* Video Upload */}
            <Box mt={2} mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                Upload Video {contentType === 'news' && '(Optional)'}
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ mb: 1 }}
              >
                Choose Video File
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={(e) => setFormData({ ...formData, videoFile: e.target.files[0] })}
                />
              </Button>
              {formData.videoFile && (
                <Typography variant="body2" color="textSecondary">
                  Selected: {formData.videoFile.name}
                </Typography>
              )}
            </Box>

            {/* Image Upload */}
            <Box mt={2} mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                Upload {contentType === 'news' ? 'Image' : 'Thumbnail'}
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload />}
                fullWidth
                sx={{ mb: 1 }}
              >
                Choose Image File
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
                />
              </Button>
              {formData.imageFile && (
                <Typography variant="body2" color="textSecondary">
                  Selected: {formData.imageFile.name}
                </Typography>
              )}
            </Box>

            {uploadProgress > 0 && (
              <Box mt={2}>
                <Typography variant="body2">Upload Progress: {uploadProgress}%</Typography>
                <Box sx={{ width: '100%', bgcolor: 'grey.300', borderRadius: 1, mt: 1 }}>
                  <Box
                    sx={{
                      width: `${uploadProgress}%`,
                      bgcolor: '#8B5CF6',
                      height: 8,
                      borderRadius: 1,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: '#8B5CF6', '&:hover': { backgroundColor: '#7C3AED' } }}
          >
            {loading ? <CircularProgress size={24} /> : (editingItem ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentManagement;