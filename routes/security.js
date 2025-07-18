const express = require('express');
const router = express.Router();

// Mock security threats data
const mockThreats = [
  {
    id: 1,
    type: 'Failed Login Attempts',
    severity: 'medium',
    count: 15,
    lastOccurrence: new Date().toISOString(),
    source: '192.168.1.100',
    description: 'Multiple failed login attempts from same IP',
    details: 'User attempted to login with invalid credentials 15 times in last hour. Possible brute force attack.'
  },
  {
    id: 2,
    type: 'SQL Injection Attempt',
    severity: 'high',
    count: 3,
    lastOccurrence: new Date(Date.now() - 30000).toISOString(),
    source: '203.45.67.89',
    description: 'Malicious SQL queries detected',
    details: 'Attempted to inject SQL code in search parameters: SELECT * FROM users WHERE 1=1; DROP TABLE users;'
  },
  {
    id: 3,
    type: 'Unusual API Usage',
    severity: 'low',
    count: 50,
    lastOccurrence: new Date(Date.now() - 120000).toISOString(),
    source: '10.0.0.25',
    description: 'High frequency API calls',
    details: 'Single IP made 50 API calls in 1 minute, possible bot activity or scraping attempt'
  },
  {
    id: 4,
    type: 'Cross-Site Scripting (XSS)',
    severity: 'high',
    count: 2,
    lastOccurrence: new Date(Date.now() - 300000).toISOString(),
    source: '45.123.67.89',
    description: 'Script injection attempt detected',
    details: 'Attempted to inject JavaScript code: <script>alert("XSS")</script> in form fields'
  },
  {
    id: 5,
    type: 'Unauthorized Access Attempt',
    severity: 'medium',
    count: 8,
    lastOccurrence: new Date(Date.now() - 600000).toISOString(),
    source: '172.16.0.50',
    description: 'Access to restricted endpoints',
    details: 'Multiple attempts to access /admin endpoints without proper authentication'
  }
];

// Get security threats
router.get('/security-threats', async (req, res) => {
  try {
    // In production, this would fetch from security monitoring system
    res.json({
      threats: mockThreats,
      summary: {
        total: mockThreats.length,
        high: mockThreats.filter(t => t.severity === 'high').length,
        medium: mockThreats.filter(t => t.severity === 'medium').length,
        low: mockThreats.filter(t => t.severity === 'low').length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get threat details
router.get('/security-threats/:id', async (req, res) => {
  try {
    const threatId = parseInt(req.params.id);
    const threat = mockThreats.find(t => t.id === threatId);
    
    if (!threat) {
      return res.status(404).json({ message: 'Threat not found' });
    }
    
    res.json(threat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Block IP address
router.post('/block-ip', async (req, res) => {
  try {
    const { ipAddress, reason } = req.body;
    
    // In production, this would add IP to firewall/security system
    console.log(`Blocking IP: ${ipAddress}, Reason: ${reason}`);
    
    res.json({ 
      message: 'IP address blocked successfully',
      blockedIP: ipAddress,
      reason: reason
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;