import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Button, Box, List, ListItem, 
  ListItemText, Chip, TextField, Alert, CircularProgress
} from '@mui/material';
import { Send, Refresh, ContentCopy } from '@mui/icons-material';
import axios from 'axios';

function AdminMarketingHub() {
  const [marketingData, setMarketingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadMarketingData();
    // Auto-refresh every 24 hours
    const interval = setInterval(loadMarketingData, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadMarketingData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin-marketing/marketing-dashboard');
      setMarketingData(response.data);
    } catch (error) {
      console.error('Failed to load marketing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendBulkEmails = async () => {
    try {
      setSending(true);
      setResult({ status: 'sending', message: 'Sending emails...' });
      
      const response = await axios.post('/api/admin-marketing/send-bulk-emails', {
        contacts: marketingData.contactList,
        emailContent: marketingData.emailTemplate
      });
      
      setResult({
        success: true,
        totalSent: response.data.totalSent || 0,
        totalFailed: response.data.totalFailed || 0,
        results: response.data.results || [],
        message: `✅ Email campaign completed! Sent: ${response.data.totalSent || 0}, Failed: ${response.data.totalFailed || 0}`
      });
    } catch (error) {
      setResult({ 
        success: false,
        error: 'Failed to send emails', 
        details: error.response?.data?.message || error.message,
        message: `❌ Email sending failed: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setSending(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🚀 Marketing Automation Hub
      </Typography>

      {/* Contact List */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Website Contacts ({marketingData?.contactList?.length || 0})</Typography>
            <Button startIcon={<Refresh />} onClick={loadMarketingData} disabled={loading}>
              Refresh List
            </Button>
          </Box>
          
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {marketingData?.contactList?.map((contact, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={contact.name}
                  secondary={`${contact.email} - ${contact.category}`}
                />
                <Chip label={contact.status} size="small" />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Embed Code */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Embed Code</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={marketingData?.embedCode || ''}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button 
            startIcon={<ContentCopy />} 
            onClick={() => copyToClipboard(marketingData?.embedCode)}
          >
            Copy Embed Code
          </Button>
        </CardContent>
      </Card>

      {/* Email Template */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Email Template</Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            value={marketingData?.emailTemplate || ''}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button 
            startIcon={<ContentCopy />} 
            onClick={() => copyToClipboard(marketingData?.emailTemplate)}
          >
            Copy Email Template
          </Button>
        </CardContent>
      </Card>

      {/* Send Emails Button */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Auto-Send Marketing Emails</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This will automatically send personalized emails to all contacts in the list.
          </Typography>
          
          <Button 
            variant="contained" 
            size="large"
            startIcon={<Send />}
            onClick={sendBulkEmails}
            disabled={sending || !marketingData?.contactList?.length}
            sx={{ mr: 2 }}
          >
            {sending ? '📧 Sending Emails...' : `📧 Send to ${marketingData?.contactList?.length || 0} Contacts`}
          </Button>
          
          {!marketingData?.contactList?.length && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No contacts available. Contacts will appear here when people visit your website.
            </Alert>
          )}

          {sending && <CircularProgress size={24} sx={{ ml: 2 }} />}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>📧 Email Campaign Results</Typography>
            
            <Alert 
              severity={result.success === false ? 'error' : result.status === 'sending' ? 'info' : 'success'} 
              sx={{ mb: 2 }}
            >
              {result.message}
            </Alert>
            
            {result.success && result.results && (
              <>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  📊 Campaign Summary: {result.totalSent} sent, {result.totalFailed} failed
                </Typography>
                
                <List sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  {result.results.map((res, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={res.contact || res.email}
                        secondary={
                          <Box>
                            <Typography variant="body2">{res.email}</Typography>
                            {res.error && (
                              <Typography variant="caption" color="error">
                                Error: {res.error}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <Chip 
                        label={res.status === 'sent' ? '✅ Sent' : '❌ Failed'} 
                        color={res.status === 'sent' ? 'success' : 'error'} 
                        size="small" 
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            
            {result.success === false && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Common Issues:</strong><br/>
                  • Check if EMAIL_USER and EMAIL_PASS are set in environment variables<br/>
                  • Verify Gmail App Password is correct<br/>
                  • Ensure 2FA is enabled on Gmail account<br/>
                  • Check if SMTP settings are correct
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default AdminMarketingHub;