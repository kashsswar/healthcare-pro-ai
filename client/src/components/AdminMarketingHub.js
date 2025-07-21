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
      const response = await axios.post('/api/admin-marketing/send-bulk-emails', {
        contacts: marketingData.contactList,
        emailContent: marketingData.emailTemplate
      });
      setResult(response.data);
    } catch (error) {
      setResult({ error: 'Failed to send emails', details: error.message });
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

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Website Contacts ({marketingData?.contactList?.length || 0})</Typography>
          
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

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>WhatsApp Campaign</Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            value={marketingData?.whatsappTemplate || ''}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button 
            startIcon={<ContentCopy />} 
            onClick={() => copyToClipboard(marketingData?.whatsappTemplate || '')}
          >
            Copy WhatsApp Message
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Email Campaign</Typography>
          <TextField
            fullWidth
            multiline
            rows={12}
            value={marketingData?.emailTemplate || ''}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button 
            startIcon={<ContentCopy />} 
            onClick={() => copyToClipboard(marketingData?.emailTemplate || '')}
          >
            Copy Email Template
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Send Campaigns</Typography>
          
          <Button 
            variant="contained" 
            size="large"
            startIcon={<Send />}
            onClick={sendBulkEmails}
            disabled={sending || !marketingData?.contactList}
            sx={{ mr: 2 }}
          >
            {sending ? 'Sending...' : `Send to ${marketingData?.contactList?.length || 0} Contacts`}
          </Button>

          {result && (
            <Alert severity={result.error ? 'error' : 'success'} sx={{ mt: 2 }}>
              {result.error || `Emails sent successfully! Sent: ${result.totalSent}, Failed: ${result.totalFailed}`}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default AdminMarketingHub;