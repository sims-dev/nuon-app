import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People,
  School,
  Event,
  VideoLibrary,
  TrendingUp,
  AttachMoney
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEvents: 0,
    totalWorkshops: 0,
    totalRevenue: 0,
    activeUsers: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats(response.data.stats || {});
      setChartData(response.data.chartData || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setError('Failed to load analytics');
      
      // Mock data for demo
      setStats({
        totalUsers: 1247,
        totalCourses: 23,
        totalEvents: 8,
        totalWorkshops: 15,
        totalRevenue: 234500,
        activeUsers: 892
      });
      
      setChartData([
        { name: 'Jan', users: 65, revenue: 25000 },
        { name: 'Feb', users: 89, revenue: 32000 },
        { name: 'Mar', users: 120, revenue: 45000 },
        { name: 'Apr', users: 156, revenue: 52000 },
        { name: 'May', users: 200, revenue: 68000 },
        { name: 'Jun', users: 245, revenue: 78000 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography color="textSecondary" variant="body2">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: color, fontSize: 48 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const pieData = [
    { name: 'Courses', value: stats.totalCourses, color: '#8B5CF6' },
    { name: 'Events', value: stats.totalEvents, color: '#10B981' },
    { name: 'Workshops', value: stats.totalWorkshops, color: '#F59E0B' }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" mb={3}>
        Analytics Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers?.toLocaleString()}
            icon={<People />}
            color="#8B5CF6"
            subtitle={`${stats.activeUsers} active users`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue?.toLocaleString()}`}
            icon={<AttachMoney />}
            color="#10B981"
            subtitle="This month"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={<School />}
            color="#F59E0B"
            subtitle="Published courses"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Events"
            value={stats.totalEvents}
            icon={<Event />}
            color="#EF4444"
            subtitle="Upcoming events"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Workshops"
            value={stats.totalWorkshops}
            icon={<VideoLibrary />}
            color="#3B82F6"
            subtitle="Active workshops"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Growth Rate"
            value="12.5%"
            icon={<TrendingUp />}
            color="#8B5CF6"
            subtitle="Monthly growth"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* User Growth Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" mb={2}>User Growth & Revenue</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  name="New Users"
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Revenue (₹)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Content Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" mb={2}>Content Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Monthly Revenue Bar Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" mb={2}>Monthly Revenue Breakdown</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Legend />
                <Bar dataKey="revenue" fill="#8B5CF6" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;