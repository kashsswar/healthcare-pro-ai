const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class AIRefreshService {
  // AI determines when patient should see updated doctor recommendations
  static async shouldRefreshPatientData(patientActivity, lastRefresh) {
    try {
      const prompt = `Analyze patient activity and determine if they need fresh doctor recommendations:
      
      Patient Activity:
      - Last search: ${patientActivity.lastSearch}
      - Search count: ${patientActivity.searchCount}
      - Time spent: ${patientActivity.timeSpent} minutes
      - Last refresh: ${lastRefresh}
      - Current time: ${new Date().toISOString()}
      
      Consider:
      1. Has patient been searching actively?
      2. Are they likely to need updated availability?
      3. Should they see new featured doctors?
      4. Time since last refresh
      
      Respond with JSON: {"shouldRefresh": true/false, "reason": "explanation", "priority": "low/medium/high"}`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      // Fallback logic
      const timeSinceRefresh = Date.now() - new Date(lastRefresh).getTime();
      const shouldRefresh = timeSinceRefresh > 300000; // 5 minutes
      
      return {
        shouldRefresh,
        reason: "Fallback: Time-based refresh",
        priority: "medium"
      };
    }
  }

  // AI determines when admin should see updated analytics
  static async shouldRefreshAdminData(adminActivity, systemChanges) {
    try {
      const prompt = `Analyze admin activity and system changes to determine if admin dashboard needs refresh:
      
      Admin Activity:
      - Last action: ${adminActivity.lastAction}
      - Actions performed: ${adminActivity.actionsCount}
      - Time in dashboard: ${adminActivity.timeInDashboard} minutes
      
      System Changes:
      - New doctor registrations: ${systemChanges.newDoctors}
      - New appointments: ${systemChanges.newAppointments}
      - Rating changes: ${systemChanges.ratingChanges}
      - Revenue updates: ${systemChanges.revenueUpdates}
      
      Should admin see fresh data? Consider:
      1. Impact of recent changes
      2. Admin's current focus
      3. Data staleness
      4. Business critical updates
      
      Respond with JSON: {"shouldRefresh": true/false, "reason": "explanation", "priority": "low/medium/high", "focusArea": "doctors/revenue/analytics"}`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      // Fallback logic
      const hasSignificantChanges = systemChanges.newDoctors > 0 || 
                                   systemChanges.newAppointments > 5 ||
                                   systemChanges.ratingChanges > 2;
      
      return {
        shouldRefresh: hasSignificantChanges,
        reason: "Fallback: Significant system changes detected",
        priority: hasSignificantChanges ? "high" : "low",
        focusArea: "analytics"
      };
    }
  }

  // AI-powered smart refresh intervals
  static async getOptimalRefreshInterval(userType, currentActivity) {
    try {
      const prompt = `Determine optimal refresh interval for ${userType}:
      
      Current Activity:
      - User engagement: ${currentActivity.engagement}
      - Session duration: ${currentActivity.sessionDuration}
      - Action frequency: ${currentActivity.actionFrequency}
      - Data sensitivity: ${currentActivity.dataSensitivity}
      
      Calculate optimal refresh interval in seconds.
      Consider user experience, server load, and data freshness needs.
      
      Respond with JSON: {"interval": seconds, "reason": "explanation"}`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.2
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      // Fallback intervals
      const intervals = {
        patient: 180, // 3 minutes
        doctor: 120,  // 2 minutes  
        admin: 60     // 1 minute
      };
      
      return {
        interval: intervals[userType] || 180,
        reason: "Fallback: Standard interval for user type"
      };
    }
  }

  // Generate personalized refresh notifications
  static async generateRefreshNotification(userType, refreshReason, newDataSummary) {
    try {
      const prompt = `Create a friendly notification for ${userType} about data refresh:
      
      Refresh Reason: ${refreshReason}
      New Data: ${newDataSummary}
      
      Create a brief, engaging notification message that:
      1. Explains why refresh happened
      2. Highlights what's new/important
      3. Encourages user engagement
      4. Keeps professional tone
      
      Max 50 words.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 80,
        temperature: 0.7
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      const defaultMessages = {
        patient: "🔄 Fresh doctor recommendations available! New appointments slots and featured doctors updated.",
        admin: "📊 Dashboard updated with latest analytics and revenue data.",
        doctor: "📋 Your queue and appointments have been refreshed."
      };
      
      return defaultMessages[userType] || "Data has been refreshed with latest information.";
    }
  }
}

module.exports = AIRefreshService;