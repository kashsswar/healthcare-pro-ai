import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Button, Box, LinearProgress,
  Dialog, DialogContent, TextField, Chip
} from '@mui/material';
import { TrendingUp, Share, EmojiEvents } from '@mui/icons-material';

function ViralGrowthEngine({ user }) {
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [viralScore, setViralScore] = useState(0);

  useEffect(() => {
    generateReferralCode();
    calculateViralScore();
  }, []);

  const generateReferralCode = () => {
    const code = `HEALTH${user?.name?.substring(0,3).toUpperCase()}${Math.random().toString(36).substring(2,6).toUpperCase()}`;
    setReferralCode(code);
  };

  const calculateViralScore = () => {
    // Simulate viral score based on user activity
    const score = Math.min(100, (referralCount * 10) + Math.floor(Math.random() * 30));
    setViralScore(score);
  };

  const shareReferralLink = async () => {
    const shareText = `🏥 I found the best healthcare platform! Get ₹100 OFF your first consultation with my code: ${referralCode}\n\n✅ 500+ Verified Doctors\n✅ Instant Booking\n✅ AI Health Tips\n\nJoin HealthConnect AI: ${window.location.origin}?ref=${referralCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HealthConnect AI - Get ₹100 OFF!',
          text: shareText,
          url: `${window.location.origin}?ref=${referralCode}`
        });
      } catch (error) {
        navigator.clipboard.writeText(shareText);
        alert('Referral link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Referral link copied to clipboard!');
    }
  };

  const autoGenerateContent = () => {
    const contents = [
      `🚀 Just booked my doctor appointment in 30 seconds! No waiting, no hassle. Healthcare made simple with HealthConnect AI! Use code ${referralCode} for ₹100 OFF! 💊✨`,
      `💡 AI recommended the perfect doctor for my symptoms! This platform is revolutionary. Try it with my code ${referralCode} and save ₹100! 🏥`,
      `⏰ Remember when booking doctor appointments took hours? Not anymore! HealthConnect AI changed everything. Get ₹100 OFF with ${referralCode}! 🎯`
    ];
    
    return contents[Math.floor(Math.random() * contents.length)];
  };

  return (
    <>
      <Card sx={{ mb: 2, background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrendingUp sx={{ mr: 1, color: 'white' }} />
            <Typography variant="h6" sx={{ color: 'white' }}>Viral Growth Engine</Typography>
            <Chip label={`Score: ${viralScore}`} sx={{ ml: 2, bgcolor: 'white' }} />
          </Box>
          
          <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
            Your referral code: <strong>{referralCode}</strong>
          </Typography>
          
          <LinearProgress 
            variant="determinate" 
            value={viralScore} 
            sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.3)' }}
          />
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              sx={{ bgcolor: 'white', color: 'primary.main' }}
              startIcon={<Share />}
              onClick={shareReferralLink}
            >
              Share & Earn ₹50
            </Button>
            <Button 
              variant="outlined" 
              sx={{ borderColor: 'white', color: 'white' }}
              onClick={() => setShowShareDialog(true)}
            >
              Auto-Generate Post
            </Button>
          </Box>
          
          <Typography variant="caption" sx={{ color: 'white', display: 'block', mt: 1 }}>
            🎯 Referred: {referralCount} users | Next reward at 5 referrals
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <Typography variant="h6" gutterBottom>AI-Generated Viral Content</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={autoGenerateContent()}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              onClick={() => {
                navigator.clipboard.writeText(autoGenerateContent());
                setShowShareDialog(false);
                alert('Content copied! Share it on social media.');
              }}
            >
              Copy & Share
            </Button>
            <Button onClick={() => setShowShareDialog(false)}>Close</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ViralGrowthEngine;