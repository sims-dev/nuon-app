import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MentorLogin from './MentorLogin';
import DashboardHome from './DashboardHome';
import Profile from './Profile';
import Availability from './Availability';
import SessionRequests from './SessionRequests';
import SessionHistory from './SessionHistory';
import Notifications from './Notifications';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/mentor/login" replace />;
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/mentor/login" element={<MentorLogin />} />
      <Route path="/mentor/home" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
      <Route path="/mentor/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/mentor/availability" element={<ProtectedRoute><Availability /></ProtectedRoute>} />
      <Route path="/mentor/sessions" element={<ProtectedRoute><SessionRequests /></ProtectedRoute>} />
      <Route path="/mentor/history" element={<ProtectedRoute><SessionHistory /></ProtectedRoute>} />
      <Route path="/mentor/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/mentor/login" replace />} />
      <Route path="*" element={<Navigate to="/mentor/login" replace />} />
    </Routes>
  </Router>
);

export default App;
