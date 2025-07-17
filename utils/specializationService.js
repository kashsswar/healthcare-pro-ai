const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Main 12 medical specializations
const MEDICAL_SPECIALIZATIONS = [
  'General Medicine',
  'Cardiology', 
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Gynecology',
  'Neurology',
  'Psychiatry',
  'Dentistry',
  'Ophthalmology',
  'ENT',
  'General Surgery'
];

class SpecializationService {
  static getAllSpecializations() {
    return MEDICAL_SPECIALIZATIONS;
  }

  static async validateSpecialization(specialization) {
    if (MEDICAL_SPECIALIZATIONS.includes(specialization)) {
      return { valid: true, standardized: specialization };
    }

    try {
      const prompt = `
        Analyze this medical specialization: "${specialization}"
        
        1. Is this a valid medical specialization?
        2. If valid, provide the standardized name
        3. If not valid, suggest the closest valid specialization
        
        Respond in JSON format:
        {
          "valid": true/false,
          "standardized": "standardized name",
          "suggestion": "closest match if not valid"
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI validation error:', error);
      return { 
        valid: true, 
        standardized: specialization,
        suggestion: null 
      };
    }
  }

  static async addCustomSpecialization(specialization) {
    const validation = await this.validateSpecialization(specialization);
    
    if (validation.valid && !MEDICAL_SPECIALIZATIONS.includes(validation.standardized)) {
      // Add to the list (in production, save to database)
      MEDICAL_SPECIALIZATIONS.push(validation.standardized);
      return validation.standardized;
    }
    
    return validation.standardized;
  }
}

module.exports = SpecializationService;