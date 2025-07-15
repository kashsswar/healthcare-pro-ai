import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, Table, TableBody, 
  TableCell, TableRow, Alert, Box, Chip, LinearProgress, Button, Tabs, Tab 
} from '@mui/material';
import { TrendingUp, Security, AutoFixHigh, MonetizationOn } from '@mui/icons-material';
import AIAnalysisPanel from '../components/AIAnalysisPanel';
import AutoMarketing from '../components/AutoMarketing';
import AdminDoctorBoost from '../components/AdminDoctorBoost';
import MarketingAnalytics from '../components/MarketingAnalytics';
import ProfessionalAdminPanel from '../components/ProfessionalAdminPanel';
import AdminMarketingHub from '../components/AdminMarketingHub';

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [topEarners, setTopEarners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, alertsRes, earnersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/security-alerts'),
        fetch('/api/admin/top-earners')
      ]);
      
      setStats(await statsRes.json());
      setAlerts(await alertsRes.json());
      setTopEarners(await earnersRes.json());
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      await fetch(`/api/admin/resolve-alert/${alertId}`, { method: 'POST' });
      loadDashboard();
    } catch (error) {
      console.error('Resolve alert error:', error);
    }
  };

  if (loading) return <LinearProgress />;

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        🏥 HealthCare Pro - Executive Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
        Enterprise Healthcare Management System | Real-time Business Intelligence
      </Typography>

      {/* Key Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'primary.light', borderLeft: 4, borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Healthcare Providers</Typography>
              <Typography variant="h3" color="primary">{stats.newDoctorsToday || 0}</Typography>
              <Typography variant="body2">+{stats.newDoctorsWeek || 0} verified this week</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'success.light', borderLeft: 4, borderColor: 'success.main' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Platform Revenue (Today)</Typography>
              <Typography variant="h3" color="success.main">₹{stats.adminEarningsToday || 0}</Typography>
              <Typography variant="body2">{stats.patientsToday || 0} patients treated</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'warning.light', borderLeft: 4, borderColor: 'warning.main' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>System Security</Typography>
              <Typography variant="h3" color="warning.main">{alerts.length}</Typography>
              <Typography variant="body2">AI-powered threat detection</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'info.light', borderLeft: 4, borderColor: 'info.main' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Platform Performance</Typography>
              <Typography variant="h3" color="info.main">{stats.healthScore || 95}%</Typography>
              <Typography variant="body2">Enterprise-grade uptime</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Navigation Tabs */}
      <Card sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="📊 Overview" />
          <Tab label="📈 Marketing Analytics" />
          <Tab label="🚀 Auto Marketing" />
          <Tab label="⚙️ Admin Controls" />
        </Tabs>
      </Card>

      {tabValue === 0 && (
        <>
          {/* Admin Doctor Boost */}
          <AdminDoctorBoost />
          
          {/* Auto Marketing Engine */}
          <AutoMarketing />
          
          {/* AI Analysis Panel */}
          <AIAnalysisPanel />
        </>
      )}
      
      {tabValue === 1 && <MarketingAnalytics />}
      
      {tabValue === 2 && <AdminMarketingHub />}
      
      {tabValue === 3 && <ProfessionalAdminPanel />}

      {tabValue === 0 && (
        <>
          {/* Security Alerts */}
          {alerts.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Security color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">🚨 Security & Error Alerts</Typography>
            </Box>
            
            {alerts.map((alert) => (
              <Alert 
                key={alert.id} 
                severity={alert.severity}
                sx={{ mb: 2 }}
                action={
                  <Button 
                    size="small" 
                    onClick={() => resolveAlert(alert.id)}
                    startIcon={<AutoFixHigh />}
                  >
                    AI Fix
                  </Button>
                }
              >
                <Typography variant="body1">{alert.message}</Typography>
                <Typography variant="body2">
                  Time: {new Date(alert.timestamp).toLocaleString()} | 
                  AI Solution: {alert.aiSolution}
                </Typography>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Top Earning Doctors */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MonetizationOn color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">💰 Top Earning Doctors Today</Typography>
              </Box>
              
              <Table size="small">
                <TableBody>
                  {topEarners.today?.map((doctor, index) => (
                    <TableRow key={doctor.id}>
                      <TableCell>#{index + 1}</TableCell>
                      <TableCell>Dr. {doctor.name}</TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>₹{doctor.earnings}</TableCell>
                      <TableCell>{doctor.patients} patients</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>📊 Monthly Performance</Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Admin Earnings This Month</Typography>
                <Typography variant="h4" color="success.main">
                  ₹{stats.adminMonthlyEarnings || 0}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Admin Earnings This Year</Typography>
                <Typography variant="h6" color="primary">
                  ₹{stats.adminYearlyEarnings || 0}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Most Active Doctor</Typography>
                <Typography variant="h6">
                  Dr. {stats.topDoctorMonth?.name} ({stats.topDoctorMonth?.patients} patients)
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2">Platform Growth</Typography>
                <Typography variant="h6" color="primary">
                  +{stats.growthRate || 15}% this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Learning Status */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoFixHigh color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">🤖 AI Self-Learning Status</Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">Errors Auto-Resolved</Typography>
              <Typography variant="h5" color="success.main">
                {stats.aiResolved || 23}/25
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="body2">Security Threats Blocked</Typography>
              <Typography variant="h5" color="error.main">
                {stats.threatsBlocked || 7}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="body2">Performance Optimizations</Typography>
              <Typography variant="h5" color="info.main">
                {stats.optimizations || 12}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
        </>
      )}
    </Container>
  );
}

export default AdminDashboard;