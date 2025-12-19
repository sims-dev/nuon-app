import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  IconButton,
  Alert
} from '@mui/material';
import { ContentCopy, Email, Lock, Person } from '@mui/icons-material';

const MentorCredentialsDialog = ({ open, onClose, mentorData }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!mentorData) return null;

  const credentialsText = `
Mentor Account Created Successfully!

Login Credentials:
Email: ${mentorData.email}
Password: ${mentorData.password}
Role: Mentor

Please share these credentials securely with the mentor.
They can login at: http://localhost:3000/mentor
`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#8B5CF6', color: 'white' }}>
        <Box display="flex" alignItems="center">
          <Person sx={{ mr: 1 }} />
          Mentor Account Created
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Mentor account has been created successfully! Please share these credentials with the mentor.
        </Alert>

        <Paper sx={{ p: 3, bgcolor: '#F8F9FA', border: '1px solid #E9ECEF' }}>
          <Typography variant="h6" gutterBottom color="primary">
            Login Credentials
          </Typography>
          
          <Box display="flex" alignItems="center" mb={2}>
            <Email sx={{ color: '#6B7280', mr: 2 }} />
            <Box>
              <Typography variant="body2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {mentorData.email}
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={() => copyToClipboard(mentorData.email)}
              sx={{ ml: 'auto' }}
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" alignItems="center" mb={2}>
            <Lock sx={{ color: '#6B7280', mr: 2 }} />
            <Box>
              <Typography variant="body2" color="textSecondary">
                Password
              </Typography>
              <Typography variant="body1" fontWeight="medium" fontFamily="monospace">
                {mentorData.password}
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={() => copyToClipboard(mentorData.password)}
              sx={{ ml: 'auto' }}
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Mentor Dashboard URL
            </Typography>
            <Typography variant="body1" fontWeight="medium" color="primary">
              http://localhost:3000/mentor
            </Typography>
          </Box>
        </Paper>

        <Box mt={2}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<ContentCopy />}
            onClick={() => copyToClipboard(credentialsText)}
            sx={{ mb: 1 }}
          >
            Copy All Credentials
          </Button>
          
          {copied && (
            <Typography variant="body2" color="success.main" textAlign="center">
              ✓ Copied to clipboard!
            </Typography>
          )}
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Important:</strong> Please share these credentials securely with the mentor. 
            They should change their password after first login.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MentorCredentialsDialog;