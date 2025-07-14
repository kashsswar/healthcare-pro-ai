import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Grid, Table, TableBody, TableCell, TableHead, TableRow, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore, TrendingUp, People, Campaign } from '@mui/icons-material';
import axios from 'axios';

const MarketingAnalytics = () => {
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/admin/marketing-analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>📊 Marketing Analytics Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
            <People color="success" sx={{ fontSize: 40 }} />
            <Typography variant="h4">{analytics.stats?.totalDoctors || 0}</Typography>
            <Typography color="textSecondary">Total Doctors</Typography>
            <Chip label={`+${analytics.stats?.newDoctors || 0} this month`} size="small" color="success" />
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
            <People color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h4">{analytics.stats?.totalPatients || 0}</Typography>
            <Typography color="textSecondary">Total Patients</Typography>
            <Chip label={`+${analytics.stats?.newPatients || 0} this month`} size="small" color="primary" />
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Campaign color="warning" sx={{ fontSize: 40 }} />
            <Typography variant="h4">{analytics.stats?.channelStats?.length || 0}</Typography>
            <Typography color="textSecondary">Active Channels</Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#fce4ec' }}>
            <TrendingUp color="secondary" sx={{ fontSize: 40 }} />
            <Typography variant="h4">
              {analytics.stats?.channelStats?.reduce((acc, ch) => acc + ch.totalReach, 0) || 0}
            </Typography>
            <Typography color="textSecondary">Total Reach</Typography>
          </Card>
        </Grid>
      </Grid>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">📍 WHERE We Market</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Channel</TableCell>
                <TableCell>Target Audience</TableCell>
                <TableCell>Reach</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.channels?.map((channel, index) => (
                <TableRow key={index}>
                  <TableCell>{channel.name}</TableCell>
                  <TableCell>{channel.target}</TableCell>
                  <TableCell>{channel.reach}</TableCell>
                  <TableCell><Chip label="Active" color="success" size="small" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">📝 WHAT We Say (Marketing Content)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle1" gutterBottom>For Doctors (WhatsApp)</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontSize: '0.85rem' }}>
                  {analytics.marketingContent?.whatsapp_doctors}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle1" gutterBottom>For Patients (WhatsApp)</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontSize: '0.85rem' }}>
                  {analytics.marketingContent?.whatsapp_patients}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">📈 HOW It Performs (Channel Stats)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Channel</TableCell>
                <TableCell>Total Reach</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Doctors Joined</TableCell>
                <TableCell>Patients Joined</TableCell>
                <TableCell>Conversion Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.stats?.channelStats?.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell>{stat._id}</TableCell>
                  <TableCell>{stat.totalReach}</TableCell>
                  <TableCell>{stat.totalClicks}</TableCell>
                  <TableCell>{stat.doctorConversions}</TableCell>
                  <TableCell>{stat.patientConversions}</TableCell>
                  <TableCell>
                    {stat.totalReach > 0 ? 
                      `${(((stat.doctorConversions + stat.patientConversions) / stat.totalReach) * 100).toFixed(1)}%` 
                      : '0%'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default MarketingAnalytics;