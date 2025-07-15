import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Button, Box, Chip, Dialog, DialogContent
} from '@mui/material';
import { Campaign, Share, ContentCopy } from '@mui/icons-material';
import axios from 'axios';

// This component can be embedded on external websites or used for marketing
function PublicMarketingEngine() {
  const [outreachContent, setOutreachContent] = useState('');
  const [healthAwareness, setHealthAwareness] = useState(null);
  const [problemSolution, setProblemSolution] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateMarketingContent();
  }, []);

  const generateMarketingContent = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      
      // Get outreach content for patients
      const outreachRes = await axios.get(`${apiUrl}/api/outreach-marketing/generate-outreach-content?platform=social&target=patient`);
      const randomContent = outreachRes.data.content[Math.floor(Math.random() * outreachRes.data.content.length)];
      setOutreachContent(randomContent);
      
      // Get health awareness content
      const healthRes = await axios.get(`${apiUrl}/api/outreach-marketing/health-awareness`);
      setHealthAwareness(healthRes.data);
      
      // Get problem-solution content
      const problemRes = await axios.get(`${apiUrl}/api/outreach-marketing/problem-solution`);
      setProblemSolution(problemRes.data);
    } catch (error) {
      console.error('Marketing content generation failed:', error);
      // Fallback content
      setOutreachContent("🏥 Tired of waiting hours for doctor appointments? HealthConnect AI connects you with verified doctors instantly. No queues, no hassle.");
      setHealthAwareness({
        topic: "Health Checkup",
        content: "Regular health checkups can prevent 70% of serious health issues. When did you last visit a doctor?",
        cta: "Find a doctor now"
      });
    }
  };

  const shareContent = async (content) => {
    const shareText = `${content}\n\nTry HealthConnect AI: ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HealthConnect AI',
          text: shareText,
          url: window.location.origin
        });
      } catch (error) {
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      {/* Main Outreach Content */}
      <Card sx={{ mb: 2, border: '2px solid #2196f3' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Campaign color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Healthcare Made Simple</Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem' }}>
            {outreachContent}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => window.open(window.location.origin, '_blank')}
            >
              Try Now - Free
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<Share />}
              onClick={() => shareContent(outreachContent)}
            >
              Share
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="500+ Doctors" size="small" />
            <Chip label="12+ Specializations" size="small" />
            <Chip label="Zero Waiting Time" size="small" />
          </Box>
        </CardContent>
      </Card>

      {/* Health Awareness */}
      {healthAwareness && (
        <Card sx={{ mb: 2, bgcolor: 'success.light' }}>
          <CardContent>
            <Typography variant="h6" color="success.dark" gutterBottom>
              {healthAwareness.topic}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {healthAwareness.content}
            </Typography>
            <Button 
              size="small" 
              variant="contained" 
              color="success"
              onClick={() => window.open(`${window.location.origin}/doctors`, '_blank')}
            >
              {healthAwareness.cta}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Problem-Solution */}
      {problemSolution && (
        <Card sx={{ mb: 2, bgcolor: 'warning.light' }}>
          <CardContent>
            <Typography variant="subtitle2" color="warning.dark" gutterBottom>
              Problem: {problemSolution.problem}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Solution: {problemSolution.solution}
            </Typography>
            <Button 
              size="small" 
              variant="contained" 
              color="warning"
              onClick={() => window.open(window.location.origin, '_blank')}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Generate New Content */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button 
          variant="outlined" 
          onClick={generateMarketingContent}
          sx={{ mr: 1 }}
        >
          🤖 Generate New Content
        </Button>
        <Button 
          variant="text" 
          onClick={() => setShowDialog(true)}
        >
          Embed This Widget
        </Button>
      </Box>

      {/* Embed Code Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography variant="h6" gutterBottom>Embed Marketing Widget</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Copy this code to embed the marketing widget on any website:
          </Typography>
          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
{`<iframe 
  src="${window.location.origin}/marketing-widget" 
  width="100%" 
  height="400"
  frameborder="0">
</iframe>`}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            onClick={() => copyToClipboard(`<iframe src="${window.location.origin}/marketing-widget" width="100%" height="400" frameborder="0"></iframe>`)}
          >
            Copy Embed Code
          </Button>
        </DialogContent>
      </Dialog>

      {copied && (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, bgcolor: 'success.main', color: 'white', p: 2, borderRadius: 1 }}>
          ✅ Copied to clipboard!
        </Box>
      )}
    </Box>
  );
}

export default PublicMarketingEngine;