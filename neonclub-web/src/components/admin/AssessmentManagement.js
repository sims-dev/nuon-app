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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Quiz,
  ExpandMore
} from '@mui/icons-material';
import { axios, API_BASE_URL } from '../../services/api';

const AssessmentManagement = () => {
  const [assessments, setAssessments] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [activeTab, setActiveTab] = useState('assessments');
  const [formData, setFormData] = useState({
    title: '',
    type: 'course', // 'course' or 'ncc'
    courseId: '',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    ]
  });



  useEffect(() => {
    loadAssessments();
    loadAttempts();
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📚 Courses loaded for assessment:', response.data);
      const coursesData = response.data.success ? response.data.courses : response.data;
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]);
    }
  };

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE_URL}/assessments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📚 Assessments loaded:', response.data);
      setAssessments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading assessments:', error);
      setError('Failed to load assessments');
      // Mock data for demo
      setAssessments([
        {
          _id: '1',
          title: 'Basic Nursing Assessment',
          type: 'course',
          courseId: { title: 'Nursing Fundamentals', _id: 'course1' },
          questions: [
            {
              question: 'What is the normal resting heart rate for adults?',
              options: ['60-80 bpm', '60-100 bpm', '80-120 bpm', '100-140 bpm'],
              correctAnswer: 1
            }
          ],
          isActive: true,
          createdAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadAttempts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE_URL}/assessments/attempts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📊 Assessment attempts loaded:', response.data);
      setAttempts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading attempts:', error);
      // Mock data for demo
      setAttempts([
        {
          _id: '1',
          assessmentId: { title: 'Basic Nursing Assessment', _id: '1' },
          userId: { name: 'John Doe', email: 'john@example.com', _id: 'user1' },
          score: 85,
          passed: true,
          submittedAt: new Date()
        }
      ]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      // Process questions to convert correctAnswer index to the actual answer string
      const processedQuestions = formData.questions
        .filter(q => q.question.trim() && q.options.some(opt => opt.trim()))
        .map(q => ({
          question: q.question,
          options: q.options.filter(opt => opt.trim()), // Remove empty options
          correctAnswer: q.options[q.correctAnswer] || q.options[0] // Convert index to actual answer
        }));

      const submitData = {
        title: formData.title,
        type: formData.type,
        questions: processedQuestions
      };

      // Only add courseId if it's a course assessment and a course is selected
      if (formData.type === 'course' && formData.courseId && formData.courseId !== '') {
        submitData.courseId = formData.courseId;
      } else if (formData.type === 'course') {
        // If it's a course assessment but no course selected, show error
        setError('Please select a course for course assessments');
        setLoading(false);
        return;
      }

      console.log('📝 Creating assessment:', submitData);

      const url = editingAssessment
        ? `${API_BASE_URL}/assessments/${editingAssessment._id}`
        : `${API_BASE_URL}/assessments`;
      
      const method = editingAssessment ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url,
        data: submitData,
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Assessment saved:', response.data);
      setSuccess(`Assessment ${editingAssessment ? 'updated' : 'created'} successfully`);
      setOpenDialog(false);
      resetForm();
      loadAssessments();
    } catch (error) {
      console.error('Error saving assessment:', error);
      console.error('Error details:', error.response?.data);
      setError(`Failed to save assessment: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${API_BASE_URL}/assessments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Assessment deleted successfully');
      loadAssessments();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      setError('Failed to delete assessment');
    }
  };

  const handleEdit = (assessment) => {
    setEditingAssessment(assessment);
    setFormData({
      title: assessment.title,
      type: assessment.type,
      courseId: assessment.courseId?._id || '',
      questions: assessment.questions || [
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ]
    });
    setOpenDialog(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'course',
      courseId: '',
      questions: [
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ]
    });
    setEditingAssessment(null);
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    if (field === 'question') {
      updatedQuestions[index].question = value;
    } else if (field === 'correctAnswer') {
      updatedQuestions[index].correctAnswer = parseInt(value);
    } else if (field.startsWith('option')) {
      const optionIndex = parseInt(field.replace('option', ''));
      updatedQuestions[index].options[optionIndex] = value;
    }
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
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
          Assessment Management
        </Typography>
        <Box>
          <Button
            variant={activeTab === 'assessments' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('assessments')}
            sx={{ mr: 1 }}
          >
            Assessments
          </Button>
          <Button
            variant={activeTab === 'attempts' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('attempts')}
          >
            Attempts & Results
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

      {/* Assessments Tab */}
      {activeTab === 'assessments' && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Assessments</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                resetForm();
                setOpenDialog(true);
              }}
              sx={{ backgroundColor: '#8B5CF6', '&:hover': { backgroundColor: '#7C3AED' } }}
            >
              Create Assessment
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#F3F4F6' }}>
                <TableRow>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Course</strong></TableCell>
                  <TableCell><strong>Questions</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Created</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Quiz sx={{ mr: 1, color: '#8B5CF6' }} />
                        <Typography variant="body1" fontWeight="medium">
                          {assessment.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={assessment.type?.toUpperCase()} 
                        color={assessment.type === 'ncc' ? 'secondary' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {assessment.courseId?.title || assessment.type === 'ncc' ? 'NCC Assessment' : '-'}
                    </TableCell>
                    <TableCell>{assessment.questions?.length || 0}</TableCell>
                    <TableCell>
                      <Chip 
                        label={assessment.isActive ? 'Active' : 'Inactive'} 
                        color={assessment.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(assessment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => handleEdit(assessment)}
                        color="primary"
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(assessment._id)}
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
        </Box>
      )}

      {/* Attempts Tab */}
      {activeTab === 'attempts' && (
        <Box>
          <Typography variant="h5" mb={2}>Assessment Results</Typography>
          
          <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#F3F4F6' }}>
                <TableRow>
                  <TableCell><strong>User</strong></TableCell>
                  <TableCell><strong>Assessment</strong></TableCell>
                  <TableCell><strong>Score</strong></TableCell>
                  <TableCell><strong>Result</strong></TableCell>
                  <TableCell><strong>Submitted</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attempts.map((attempt) => (
                  <TableRow key={attempt._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {attempt.userId?.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {attempt.userId?.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{attempt.assessmentId?.title}</TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {attempt.score}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={attempt.passed ? 'PASSED' : 'FAILED'} 
                        color={attempt.passed ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(attempt.submittedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Create/Edit Assessment Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Assessment Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Assessment Type</InputLabel>
              <Select
                value={formData.type}
                label="Assessment Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="course">Course Assessment</MenuItem>
                <MenuItem value="ncc">NCC Certification</MenuItem>
              </Select>
            </FormControl>

            {formData.type === 'course' && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Course</InputLabel>
                <Select
                  value={formData.courseId}
                  label="Select Course"
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                >
                  <MenuItem value="">
                    <em>Select a course</em>
                  </MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.title}
                    </MenuItem>
                  ))}
                  {courses.length === 0 && (
                    <MenuItem value="dummy-course-id" disabled>
                      No courses available - Create a course first
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            )}

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Questions
            </Typography>

            {formData.questions.map((question, qIndex) => (
              <Accordion key={qIndex} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>
                    Question {qIndex + 1}: {question.question.substring(0, 50)}
                    {question.question.length > 50 ? '...' : ''}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <TextField
                      fullWidth
                      label="Question"
                      multiline
                      rows={2}
                      value={question.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      margin="normal"
                    />

                    <Box sx={{ mt: 2 }}>
                      <FormLabel component="legend">Options</FormLabel>
                      <RadioGroup
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                      >
                        {question.options.map((option, oIndex) => (
                          <Box key={oIndex} display="flex" alignItems="center" sx={{ mt: 1 }}>
                            <FormControlLabel
                              value={oIndex}
                              control={<Radio />}
                              label=""
                              sx={{ mr: 1 }}
                            />
                            <TextField
                              fullWidth
                              label={`Option ${oIndex + 1}`}
                              value={option}
                              onChange={(e) => updateQuestion(qIndex, `option${oIndex}`, e.target.value)}
                              size="small"
                            />
                          </Box>
                        ))}
                      </RadioGroup>
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        color="error"
                        onClick={() => removeQuestion(qIndex)}
                        disabled={formData.questions.length === 1}
                      >
                        Remove Question
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addQuestion}
                sx={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}
              >
                Add Question
              </Button>
            </Box>
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
            {loading ? <CircularProgress size={24} /> : (editingAssessment ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentManagement;