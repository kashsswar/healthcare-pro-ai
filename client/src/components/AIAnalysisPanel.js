import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, List, ListItem, ListItemText, 
  Chip, Alert, LinearProgress 
} from '@mui/material';
import { Psychology, CheckCircle, Cancel, TrendingUp } from '@mui/icons-material';

function AIAnalysisPanel() {
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAIAnalysis();
    const interval = setInterval(loadAIAnalysis, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const loadAIAnalysis = async () => {
    try {
      const response = await fetch('/api/ai/analysis');
      const data = await response.json();
      setAnalysis(data.analysis);
      setRecommendations(data.recommendations);
      setPendingActions(data.pendingActions);
    } catch (error) {
      console.error('AI Analysis error:', error);
    }
  };

  const approveAction = async (actionId) => {
    try {
      setLoading(true);
      await fetch(`/api/ai/approve-action/${actionId}`, { method: 'POST' });
      alert('AI action approved and executed!');
      loadAIAnalysis();
    } catch (error) {
      alert('Failed to execute action');
    } finally {
      setLoading(false);
    }
  };

  const rejectAction = async (actionId) => {
    try {
      await fetch(`/api/ai/reject-action/${actionId}`, { method: 'POST' });
      loadAIAnalysis();
    } catch (error) {
      console.error('Reject action error:', error);
    }
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Psychology color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">🧠 AI Data Analysis & Recommendations</Typography>
        </Box>

        {analysis && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>📊 Current Insights:</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Peak Usage:</strong> {analysis.peakHours} | 
                <strong> Most Needed:</strong> {analysis.topDemand} | 
                <strong> Growth Rate:</strong> +{analysis.growthRate}%
              </Typography>
            </Alert>
            
            <Typography variant="body2">
              🎯 <strong>User Behavior:</strong> {analysis.userPattern}
            </Typography>
            <Typography variant="body2">
              💡 <strong>Opportunity:</strong> {analysis.opportunity}
            </Typography>
          </Box>
        )}

        <Typography variant="subtitle1" gutterBottom>🤖 AI Recommendations:</Typography>
        <List dense>
          {recommendations.map((rec, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={rec.title}
                secondary={`Impact: ${rec.impact} | Confidence: ${rec.confidence}%`}
              />
              <Chip 
                label={rec.priority} 
                color={rec.priority === 'High' ? 'error' : rec.priority === 'Medium' ? 'warning' : 'info'}
                size="small"
              />
            </ListItem>
          ))}
        </List>

        {pendingActions.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              ⏳ Pending Admin Approval ({pendingActions.length})
            </Typography>
            
            {pendingActions.map((action) => (
              <Alert 
                key={action.id}
                severity="warning" 
                sx={{ mb: 2 }}
                action={
                  <Box>
                    <Button 
                      size="small" 
                      color="success"
                      onClick={() => approveAction(action.id)}
                      disabled={loading}
                      startIcon={<CheckCircle />}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => rejectAction(action.id)}
                      sx={{ ml: 1 }}
                      startIcon={<Cancel />}
                    >
                      Reject
                    </Button>
                  </Box>
                }
              >
                <Typography variant="body1">{action.title}</Typography>
                <Typography variant="body2">
                  {action.description} | Expected Impact: {action.expectedImpact}
                </Typography>
              </Alert>
            ))}
          </Box>
        )}

        {loading && <LinearProgress sx={{ mt: 2 }} />}
      </CardContent>
    </Card>
  );
}

export default AIAnalysisPanel;