// Mock AI Service for Development
module.exports = {
  analyzeSymptoms: async (symptoms) => ({
    riskLevel: 'medium',
    recommendations: ['Stay hydrated', 'Monitor symptoms', 'Consult doctor if symptoms persist']
  }),
  generateHealthTips: async () => [
    'AI Analysis: Maintain optimal oral pH levels',
    'Clinical AI Insight: Hydration supports cellular regeneration',
    'AI Health Protocol: 150 minutes weekly cardiovascular exercise'
  ],
  matchDoctor: async (symptoms) => symptoms.includes('tooth') ? 'dental' : 'general'
};
