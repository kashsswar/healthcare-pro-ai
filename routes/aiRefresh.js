const express = require('express');
const AIRefreshService = require('../utils/aiRefreshService');
const router = express.Router();

// Check if patient data should be refreshed
router.post('/should-refresh-patient', async (req, res) => {
  try {
    const { patientActivity, lastRefresh } = req.body;
    const result = await AIRefreshService.shouldRefreshPatientData(patientActivity, lastRefresh);
    
    res.json({
      shouldRefresh: result.shouldRefresh,
      reason: result.reason,
      priority: result.priority
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check if admin data should be refreshed
router.post('/should-refresh-admin', async (req, res) => {
  try {
    const { adminActivity, systemChanges } = req.body;
    const result = await AIRefreshService.shouldRefreshAdminData(adminActivity, systemChanges);
    
    res.json({
      shouldRefresh: result.shouldRefresh,
      reason: result.reason,
      priority: result.priority,
      focusArea: result.focusArea
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get optimal refresh interval
router.post('/refresh-interval', async (req, res) => {
  try {
    const { userType, currentActivity } = req.body;
    const result = await AIRefreshService.getOptimalRefreshInterval(userType, currentActivity);
    
    res.json({
      interval: result.interval,
      reason: result.reason
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate refresh notification
router.post('/refresh-notification', async (req, res) => {
  try {
    const { userType, refreshReason, newDataSummary } = req.body;
    const message = await AIRefreshService.generateRefreshNotification(userType, refreshReason, newDataSummary);
    
    res.json({
      message: message
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;