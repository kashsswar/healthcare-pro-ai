const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Comprehensive list of medical specializations
const MEDICAL_SPECIALIZATIONS = [
  // Primary Care
  'General Physician', 'General Medicine', 'Family Medicine', 'Internal Medicine', 'Pediatrics',
  
  // Surgical Specialties
  'General Surgery', 'Orthopedic Surgery', 'Neurosurgery', 'Cardiac Surgery',
  'Plastic Surgery', 'Vascular Surgery', 'Thoracic Surgery',
  
  // Medical Specialties
  'Cardiology', 'Neurology', 'Gastroenterology', 'Pulmonology',
  'Nephrology', 'Endocrinology', 'Rheumatology', 'Hematology',
  'Oncology', 'Infectious Diseases',
  
  // Diagnostic Specialties
  'Radiology', 'Pathology', 'Nuclear Medicine', 'Laboratory Medicine',
  
  // Women & Children
  'Obstetrics & Gynecology', 'Pediatric Surgery', 'Neonatology',
  'Pediatric Cardiology', 'Pediatric Neurology',
  
  // Mental Health
  'Psychiatry', 'Psychology', 'Child Psychology', 'Addiction Medicine',
  
  // Sensory Specialties
  'Ophthalmology', 'ENT (Ear, Nose, Throat)', 'Audiology', 'Optometry',
  
  // Skin & Cosmetic
  'Dermatology', 'Cosmetic Surgery', 'Dermatopathology',
  
  // Dental Specialties
  'Dentistry', 'Oral Surgery', 'Orthodontics', 'Periodontics',
  'Endodontics', 'Prosthodontics', 'Pediatric Dentistry',
  
  // Emergency & Critical Care
  'Emergency Medicine', 'Critical Care Medicine', 'Trauma Surgery',
  'Anesthesiology', 'Pain Management',
  
  // Rehabilitation
  'Physical Medicine & Rehabilitation', 'Physiotherapy', 'Occupational Therapy',
  'Speech Therapy',
  
  // Alternative Medicine
  'Ayurveda', 'Homeopathy', 'Unani', 'Naturopathy', 'Acupuncture',
  
  // Specialized Fields
  'Sports Medicine', 'Geriatrics', 'Palliative Care', 'Sleep Medicine',
  'Allergy & Immunology', 'Medical Genetics', 'Preventive Medicine',
  
  // Other
  'Other (Please Specify)'
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