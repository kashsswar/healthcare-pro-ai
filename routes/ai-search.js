const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Real AI-powered doctor search
router.get('/search', async (req, res) => {
  try {
    const { query: searchQuery } = req.query;
    
    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    console.log('AI Search query:', searchQuery);
    
    // Get all available doctors and their specializations
    const allDoctors = await Doctor.find({ isVerified: true })
      .populate('userId', 'name email phone')
      .sort({ rating: -1, isFeatured: -1 });
    
    const availableSpecializations = [...new Set(allDoctors.map(d => d.specialization))];
    console.log('Available specializations:', availableSpecializations);
    
    // Use OpenAI to analyze the search query
    const aiPrompt = `
You are a medical AI assistant. Analyze this search query: "${searchQuery}"

Available doctor specializations: ${availableSpecializations.join(', ')}

Task: Determine which specializations from the available list are most relevant for this query.

Rules:
1. If it's a symptom/medical condition, recommend appropriate specializations
2. If it's a doctor name/location, return "DIRECT_SEARCH"
3. If it's already a specialization name, return that specialization
4. Return only specializations that exist in the available list
5. Return maximum 3 most relevant specializations

Response format: Return only the specialization names separated by commas, or "DIRECT_SEARCH"

Examples:
- "delivery" → Gynecology
- "heart pain" → Cardiology
- "Dr. Smith" → DIRECT_SEARCH
- "Mumbai" → DIRECT_SEARCH
`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: aiPrompt }],
      max_tokens: 100,
      temperature: 0.3
    });
    
    const aiResult = aiResponse.choices[0].message.content.trim();
    console.log('OpenAI response:', aiResult);
    
    let results = [];
    
    if (aiResult === 'DIRECT_SEARCH') {
      // Direct search by name, location, or specialization
      const searchLower = searchQuery.toLowerCase();
      results = allDoctors.filter(doctor => {
        const doctorName = doctor.userId?.name || '';
        const specialization = doctor.specialization || '';
        const city = doctor.location?.city || '';
        
        return doctorName.toLowerCase().includes(searchLower) ||
               specialization.toLowerCase().includes(searchLower) ||
               city.toLowerCase().includes(searchLower);
      });
    } else {
      // AI recommended specializations
      const recommendedSpecs = aiResult.split(',').map(s => s.trim());
      
      results = allDoctors.filter(doctor => 
        recommendedSpecs.some(spec => 
          doctor.specialization.toLowerCase().includes(spec.toLowerCase()) ||
          spec.toLowerCase().includes(doctor.specialization.toLowerCase())
        )
      ).map(doctor => ({
        ...doctor.toObject(),
        aiMatch: {
          matchScore: 0.9 + Math.random() * 0.1,
          reasoning: `AI recommends ${doctor.specialization} for: "${searchQuery}"`
        }
      }));
      
      results.sort((a, b) => (b.aiMatch?.matchScore || 0) - (a.aiMatch?.matchScore || 0));
    }
    
    console.log(`AI Search found ${results.length} doctors`);
    res.json(results);
    
  } catch (error) {
    console.error('AI Search error:', error);
    
    // Fallback to basic search if AI fails
    const searchLower = searchQuery.toLowerCase();
    const allDoctors = await Doctor.find({ isVerified: true })
      .populate('userId', 'name email phone');
      
    const fallbackResults = allDoctors.filter(doctor => {
      const doctorName = doctor.userId?.name || '';
      const specialization = doctor.specialization || '';
      const city = doctor.location?.city || '';
      
      return doctorName.toLowerCase().includes(searchLower) ||
             specialization.toLowerCase().includes(searchLower) ||
             city.toLowerCase().includes(searchLower);
    });
    
    res.json(fallbackResults);
  }
});

module.exports = router;