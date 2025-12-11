import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  CssBaseline,
  Avatar,
  Menu,
  MenuItem,
  TextField,
  Select,
  MenuItem as MuiMenuItem,
  FormControl,
  InputLabel,
  Paper,
  List as MuiList,
  ListItem as MuiListItem,
  Chip
} from '@mui/material';
import {
  Dashboard,
  People,
  VideoLibrary,
  Analytics,
  Settings,
  ExitToApp,
  Quiz,
  Message,
  Send,
  EventNote
} from '@mui/icons-material';

// Import admin components
import UserManagement from '../../components/admin/UserManagement';
import ContentManagement from '../../components/admin/ContentManagement';
import AssessmentManagement from '../../components/admin/AssessmentManagement';
import AnalyticsComponent from '../../components/admin/Analytics';
import EngageActivityManagement from '../../components/admin/EngageActivityManagement';
import io from 'socket.io-client';

const drawerWidth = 240;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [anchorEl, setAnchorEl] = useState(null);
  const [socket, setSocket] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  // Socket connection and messaging logic
  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: localStorage.getItem('accessToken')
        }
      });

      newSocket.on('connect', () => {
        console.log('Admin connected to socket');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Admin disconnected from socket');
        setIsConnected(false);
      });

      newSocket.on('mentor_message', (messageData) => {
        setMessages(prev => [...prev, { ...messageData, direction: 'incoming' }]);
      });

      setSocket(newSocket);

      // Fetch mentors
      fetchMentors();

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const fetchMentors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users?role=mentor', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMentors(data.users || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const sendMessage = () => {
    if (socket && selectedMentor && message.trim()) {
      const messageData = {
        mentorId: selectedMentor,
        message: message.trim()
      };
      socket.emit('send_admin_message', messageData);
      setMessages(prev => [...prev, {
        from: user.id,
        fromName: user.name,
        to: selectedMentor,
        message: message.trim(),
        timestamp: new Date(),
        type: 'admin_to_mentor',
        direction: 'outgoing'
      }]);
      setMessage('');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { id: 'users', label: 'User Management', icon: <People /> },
    { id: 'content', label: 'Content Management', icon: <VideoLibrary /> },
      { id: 'engage', label: 'Engage Activities', icon: <EventNote /> },
    { id: 'assessments', label: 'Assessment Management', icon: <Quiz /> },
    { id: 'messaging', label: 'Mentor Messaging', icon: <Message /> },
    { id: 'analytics', label: 'Analytics', icon: <Analytics /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'content':
        return <ContentManagement />;
           case 'engage':
             return <EngageActivityManagement />;
      case 'assessments':
        return <AssessmentManagement />;
      case 'messaging':
        return <MentorMessaging />;
      case 'analytics':
        return <AnalyticsComponent />;
      case 'settings':
        return <SettingsComponent />;
      default:
        return <DashboardOverview />;
    }
  };

  const DashboardOverview = () => (
    <Box>
      <Typography variant="h4" component="h1" mb={3}>
        Welcome to Admin Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={4}>
        Manage your Neon Club platform from this central dashboard.
      </Typography>
      
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={3}>
        <Box 
          onClick={() => setActiveSection('users')}
          sx={{ 
            p: 3, 
            bgcolor: '#F3E8FF', 
            borderRadius: 2, 
            cursor: 'pointer',
            '&:hover': { bgcolor: '#E9D5FF' }
          }}
        >
          <People sx={{ fontSize: 48, color: '#8B5CF6', mb: 2 }} />
          <Typography variant="h6" gutterBottom>User Management</Typography>
          <Typography variant="body2" color="textSecondary">
            Create mentors, manage users, assign roles
          </Typography>
        </Box>
        
        <Box 
          onClick={() => setActiveSection('content')}
          sx={{ 
            p: 3, 
            bgcolor: '#ECFDF5', 
            borderRadius: 2, 
            cursor: 'pointer',
            '&:hover': { bgcolor: '#D1FAE5' }
          }}
        >
          <VideoLibrary sx={{ fontSize: 48, color: '#10B981', mb: 2 }} />
          <Typography variant="h6" gutterBottom>Content Management</Typography>
          <Typography variant="body2" color="textSecondary">
            Upload videos, create courses, events, workshops
          </Typography>
        </Box>
        
        <Box 
          onClick={() => setActiveSection('assessments')}
          sx={{ 
            p: 3, 
            bgcolor: '#FEF3C7', 
            borderRadius: 2, 
            cursor: 'pointer',
            '&:hover': { bgcolor: '#FDE68A' }
          }}
        >
          <Quiz sx={{ fontSize: 48, color: '#F59E0B', mb: 2 }} />
          <Typography variant="h6" gutterBottom>Assessment Management</Typography>
          <Typography variant="body2" color="textSecondary">
            Create assessments, track results, manage NCC tests
          </Typography>
        </Box>
        
        <Box 
          onClick={() => setActiveSection('analytics')}
          sx={{ 
            p: 3, 
            bgcolor: '#EFF6FF', 
            borderRadius: 2, 
            cursor: 'pointer',
            '&:hover': { bgcolor: '#DBEAFE' }
          }}
        >
          <Analytics sx={{ fontSize: 48, color: '#3B82F6', mb: 2 }} />
          <Typography variant="h6" gutterBottom>Analytics</Typography>
          <Typography variant="body2" color="textSecondary">
            View statistics, reports, and insights
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const MentorMessaging = () => (
    <Box>
      <Typography variant="h4" component="h1" mb={3}>
        Mentor Messaging
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Mentor</InputLabel>
          <Select
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
            label="Select Mentor"
          >
            {mentors.map((mentor) => (
              <MuiMenuItem key={mentor._id} value={mentor._id}>
                {mentor.name} ({mentor.email})
              </MuiMenuItem>
            ))}
          </Select>
        </FormControl>

        <Chip
          label={isConnected ? "Connected" : "Disconnected"}
          color={isConnected ? "success" : "error"}
          variant="outlined"
        />
      </Box>

      <Paper sx={{ height: 400, p: 2, mb: 2, overflow: 'auto' }}>
        <Typography variant="h6" mb={2}>Messages</Typography>
        <MuiList>
          {messages.map((msg, index) => (
            <MuiListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                  {msg.fromName} ({msg.direction === 'outgoing' ? 'Admin' : 'Mentor'}):
                </Typography>
                <Typography variant="body1">{msg.message}</Typography>
              </Box>
              <Typography variant="caption" color="textSecondary">
                {new Date(msg.timestamp).toLocaleString()}
              </Typography>
            </MuiListItem>
          ))}
        </MuiList>
      </Paper>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          disabled={!selectedMentor || !isConnected}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          disabled={!selectedMentor || !message.trim() || !isConnected}
          startIcon={<Send />}
        >
          Send
        </Button>
      </Box>
    </Box>
  );

  const SettingsComponent = () => (
    <Box>
      <Typography variant="h4" component="h1" mb={3}>
        Settings
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Platform settings and configuration options coming soon...
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: '#FFFFFF',
          color: '#1F2937',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Neon Club Admin
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Welcome, {user?.name}
            </Typography>
            <Button
              onClick={handleProfileMenuOpen}
              sx={{ color: '#1F2937' }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#8B5CF6' }}>
                {user?.name?.charAt(0)}
              </Avatar>
            </Button>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#1F2937',
            color: '#FFFFFF'
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#8B5CF6', fontWeight: 'bold' }}>
            NEON CLUB
          </Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
            Admin Panel
          </Typography>
        </Box>
        
        <Divider sx={{ bgcolor: '#374151' }} />
        
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => setActiveSection(item.id)}
                sx={{
                  '&:hover': { bgcolor: '#374151' },
                  bgcolor: activeSection === item.id ? '#8B5CF6' : 'transparent'
                }}
              >
                <ListItemIcon sx={{ color: '#FFFFFF' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#F9FAFB',
          p: 3,
          mt: 8,
          minHeight: '100vh'
        }}
      >
        {renderContent()}
      </Box>

    </Box>
  );
};

export default AdminDashboard;