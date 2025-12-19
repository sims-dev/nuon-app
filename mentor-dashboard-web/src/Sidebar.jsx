import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from './AuthContext';

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/mentor/home' },
  { text: 'Profile', icon: <PersonIcon />, path: '/mentor/profile' },
  { text: 'Availability', icon: <EventAvailableIcon />, path: '/mentor/availability' },
  { text: 'Session Requests', icon: <ListAltIcon />, path: '/mentor/sessions' },
  { text: 'Session History', icon: <HistoryIcon />, path: '/mentor/history' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/mentor/notifications' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/mentor/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', background: '#181818', color: '#fff' },
      }}
    >
      <div style={{ padding: 24, fontWeight: 'bold', fontSize: 24, color: '#0af', letterSpacing: 1 }}>Mentor</div>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{ color: '#fff', '&.Mui-selected': { background: '#222', color: '#0af' } }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{ color: '#fff', '&:hover': { background: '#222' } }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
