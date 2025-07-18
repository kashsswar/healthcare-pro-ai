import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, Box, Alert, Button, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { Security, Warning, Error, Info, Refresh } from '@mui/icons-material';
import axios from 'axios';

function SecurityThreatsMonitor() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    loadThreats();
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadThreats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadThreats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/security-threats');
      setThreats(response.data.threats || []);
    } catch (error) {
      console.error('Error loading threats:', error);
      // Mock data for demonstration
      setThreats([
        {
          id: 1,
          type: 'Failed Login Attempts',
          severity: 'medium',
          count: 15,
          lastOccurrence: new Date().toISOString(),
          source: '192.168.1.100',
          description: 'Multiple failed login attempts from same IP',
          details: 'User attempted to login with invalid credentials 15 times in last hour'
        },
        {
          id: 2,
          type: 'SQL Injection Attempt',
          severity: 'high',
          count: 3,
          lastOccurrence: new Date(Date.now() - 30000).toISOString(),
          source: '203.45.67.89',
          description: 'Malicious SQL queries detected',
          details: 'Attempted to inject SQL code in search parameters: SELECT * FROM users WHERE 1=1'
        },
        {
          id: 3,
          type: 'Unusual API Usage',
          severity: 'low',
          count: 50,
          lastOccurrence: new Date(Date.now() - 120000).toISOString(),
          source: '10.0.0.25',
          description: 'High frequency API calls',
          details: 'Single IP made 50 API calls in 1 minute, possible bot activity'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <Error />;
      case 'medium': return <Warning />;
      case 'low': return <Info />;
      default: return <Security />;
    }
  };

  const showThreatDetails = (threat) => {
    setSelectedThreat(threat);
    setDetailsOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant=\"h5\" gutterBottom>
          🛡️ Security Threats Monitor
        </Typography>
        <Button 
          startIcon={<Refresh />} 
          onClick={loadThreats} 
          disabled={loading}
          variant=\"outlined\"
        >
          Refresh
        </Button>
      </Box>

      {threats.length === 0 ? (
        <Alert severity=\"success\" sx={{ mb: 3 }}>
          ✅ No security threats detected. System is secure.
        </Alert>
      ) : (
        <Alert severity=\"warning\" sx={{ mb: 3 }}>
          ⚠️ {threats.length} security threats detected. Review and take action.
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant=\"h6\" gutterBottom>
            Recent Security Events
          </Typography>
          
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Threat Type</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Count</TableCell>
                <TableCell>Source IP</TableCell>
                <TableCell>Last Occurrence</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {threats.map((threat) => (
                <TableRow key={threat.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getSeverityIcon(threat.severity)}
                      <Typography sx={{ ml: 1 }}>{threat.type}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={threat.severity.toUpperCase()} 
                      color={getSeverityColor(threat.severity)}
                      size=\"small\"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={threat.count} 
                      variant=\"outlined\" 
                      size=\"small\"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant=\"body2\" sx={{ fontFamily: 'monospace' }}>
                      {threat.source}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(threat.lastOccurrence).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size=\"small\" 
                      onClick={() => showThreatDetails(threat)}
                      variant=\"outlined\"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Threat Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth=\"md\"
        fullWidth
      >
        <DialogTitle>
          🔍 Threat Details: {selectedThreat?.type}
        </DialogTitle>
        <DialogContent>
          {selectedThreat && (
            <Box sx={{ mt: 2 }}>
              <Typography variant=\"h6\" gutterBottom>
                Threat Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant=\"body2\" color=\"text.secondary\">
                  <strong>Type:</strong> {selectedThreat.type}
                </Typography>
                <Typography variant=\"body2\" color=\"text.secondary\">
                  <strong>Severity:</strong> {selectedThreat.severity.toUpperCase()}
                </Typography>
                <Typography variant=\"body2\" color=\"text.secondary\">
                  <strong>Occurrences:</strong> {selectedThreat.count}
                </Typography>
                <Typography variant=\"body2\" color=\"text.secondary\">
                  <strong>Source IP:</strong> {selectedThreat.source}
                </Typography>
                <Typography variant=\"body2\" color=\"text.secondary\">
                  <strong>Last Seen:</strong> {new Date(selectedThreat.lastOccurrence).toLocaleString()}
                </Typography>
              </Box>

              <Typography variant=\"h6\" gutterBottom>
                Description
              </Typography>
              <Typography variant=\"body2\" sx={{ mb: 2 }}>
                {selectedThreat.description}
              </Typography>

              <Typography variant=\"h6\" gutterBottom>
                Technical Details
              </Typography>
              <Box sx={{ 
                bgcolor: 'grey.100', 
                p: 2, 
                borderRadius: 1, 
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                {selectedThreat.details}
              </Box>

              <Alert severity=\"info\" sx={{ mt: 2 }}>
                <Typography variant=\"body2\">
                  <strong>Recommended Actions:</strong><br/>
                  • Block suspicious IP addresses<br/>
                  • Review and strengthen input validation<br/>
                  • Monitor for continued activity<br/>
                  • Update security rules if needed
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SecurityThreatsMonitor;