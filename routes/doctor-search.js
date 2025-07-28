const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Intelligent AI search that handles both regular search and symptoms
router.get('/search', async (req, res) => {
  try {
    const { query: searchQuery } = req.query;
    
    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    console.log('AI Search query:', searchQuery);
    
    // Get all doctors
    const allDoctors = await Doctor.find({ isVerified: true })
      .populate('userId', 'name email phone')
      .sort({ rating: -1, isFeatured: -1 });
    
    const searchLower = searchQuery.toLowerCase();
    
    // Check if it's a symptom-based search or regular search
    const symptomKeywords = [
      'pain', 'ache', 'fever', 'headache', 'stomach', 'chest', 'back', 'joint',
      'skin', 'rash', 'cough', 'cold', 'flu', 'nausea', 'dizzy', 'tired',
      'anxiety', 'depression', 'stress', 'sleep', 'breathing', 'heart',
      'eye', 'vision', 'ear', 'hearing', 'throat', 'nose', 'bone', 'muscle'
    ];
    
    const isSymptomSearch = symptomKeywords.some(keyword => 
      searchLower.includes(keyword)
    );
    
    let results = [];
    
    if (isSymptomSearch) {
      // Get available specializations from current doctors
      const availableSpecializations = [...new Set(allDoctors.map(d => d.specialization))];
      console.log('Available specializations:', availableSpecializations);
      
      // Comprehensive dynamic symptom mapping
      const symptomSpecializationMap = {
        // General symptoms
        'fever': ['General Medicine', 'Pediatrics', 'Internal Medicine'],
        'headache': ['General Medicine', 'Neurology', 'Internal Medicine'],
        'pain': ['General Medicine', 'Orthopedics'],
        
        // Heart/Chest
        'chest pain': ['Cardiology', 'General Medicine', 'Internal Medicine'],
        'heart': ['Cardiology', 'General Medicine'],
        'cardiac': ['Cardiology'],
        'chest': ['Cardiology', 'General Medicine'],
        
        // Skin
        'skin': ['Dermatology', 'General Medicine'],
        'rash': ['Dermatology', 'General Medicine'],
        'acne': ['Dermatology'],
        
        // Digestive
        'stomach': ['General Medicine', 'Gastroenterology', 'Internal Medicine'],
        'digestive': ['Gastroenterology', 'General Medicine'],
        'nausea': ['General Medicine', 'Gastroenterology'],
        
        // Eyes
        'eye': ['Ophthalmology', 'General Medicine'],
        'vision': ['Ophthalmology', 'General Medicine'],
        'sight': ['Ophthalmology'],
        
        // ENT
        'ear': ['ENT', 'General Medicine'],
        'hearing': ['ENT', 'General Medicine'],
        'throat': ['ENT', 'General Medicine'],
        'nose': ['ENT', 'General Medicine'],
        'sinus': ['ENT', 'General Medicine'],
        
        // Orthopedics
        'bone': ['Orthopedics', 'General Medicine'],
        'joint': ['Orthopedics', 'General Medicine'],
        'muscle': ['Orthopedics', 'General Medicine'],
        'back': ['Orthopedics', 'General Medicine'],
        'fracture': ['Orthopedics'],
        'sprain': ['Orthopedics', 'General Medicine'],
        
        // Pediatrics
        'child': ['Pediatrics', 'General Medicine'],
        'baby': ['Pediatrics'],
        'infant': ['Pediatrics'],
        'kid': ['Pediatrics', 'General Medicine'],
        
        // Gynecology/Obstetrics
        'pregnancy': ['Gynecology', 'Obstetrics'],
        'pregnant': ['Gynecology', 'Obstetrics'],
        'delivery': ['Gynecology', 'Obstetrics'],
        'birth': ['Gynecology', 'Obstetrics'],
        'labor': ['Gynecology', 'Obstetrics'],
        'menstrual': ['Gynecology'],
        'period': ['Gynecology', 'General Medicine'],
        'women': ['Gynecology', 'General Medicine'],
        'female': ['Gynecology', 'General Medicine'],
        'gynec': ['Gynecology'],
        'obstetric': ['Obstetrics', 'Gynecology'],
        
        // Mental Health
        'mental': ['Psychiatry', 'Psychology', 'General Medicine'],
        'depression': ['Psychiatry', 'Psychology', 'General Medicine'],
        'anxiety': ['Psychiatry', 'Psychology', 'General Medicine'],
        'stress': ['Psychiatry', 'Psychology', 'General Medicine'],
        'sleep': ['Psychiatry', 'General Medicine'],
        'insomnia': ['Psychiatry', 'General Medicine'],
        
        // Dental
        'tooth': ['Dentistry', 'Dental Surgery'],
        'dental': ['Dentistry', 'Dental Surgery'],
        'teeth': ['Dentistry'],
        'gum': ['Dentistry'],
        
        // Urology
        'kidney': ['Urology', 'Nephrology', 'General Medicine'],
        'urine': ['Urology', 'General Medicine'],
        'bladder': ['Urology'],
        
        // Surgery
        'surgery': ['General Surgery', 'Surgery'],
        'operation': ['General Surgery', 'Surgery'],
        'surgical': ['General Surgery', 'Surgery']
      };
      
      let relevantSpecializations = [];
      
      // Check each symptom keyword against the search query
      Object.keys(symptomSpecializationMap).forEach(symptom => {
        if (searchLower.includes(symptom)) {
          console.log(`Found symptom keyword: ${symptom}`);
          // Only include specializations that actually exist in our database
          const mappedSpecs = symptomSpecializationMap[symptom].filter(spec => 
            availableSpecializations.some(availSpec => 
              availSpec.toLowerCase().includes(spec.toLowerCase()) || 
              spec.toLowerCase().includes(availSpec.toLowerCase())
            )
          );
          console.log(`Mapped to specializations: ${mappedSpecs}`);
          relevantSpecializations.push(...mappedSpecs);
        }
      });
      
      // Also check if search term directly matches any available specialization
      availableSpecializations.forEach(spec => {
        if (spec.toLowerCase().includes(searchLower) || searchLower.includes(spec.toLowerCase())) {
          relevantSpecializations.push(spec);
        }
      });
      
      relevantSpecializations = [...new Set(relevantSpecializations)];
      
      // If no specific specialization found, use General Medicine or first available
      if (relevantSpecializations.length === 0) {
        const generalMed = availableSpecializations.find(spec => 
          spec.toLowerCase().includes('general')
        );
        relevantSpecializations = generalMed ? [generalMed] : [availableSpecializations[0]];
      }
      
      console.log('Relevant specializations for symptoms:', relevantSpecializations);
      
      results = allDoctors.filter(doctor => 
        relevantSpecializations.some(spec => 
          doctor.specialization.toLowerCase().includes(spec.toLowerCase()) ||
          spec.toLowerCase().includes(doctor.specialization.toLowerCase())
        )
      ).map(doctor => ({
        ...doctor.toObject(),
        aiMatch: {
          matchScore: 0.85 + Math.random() * 0.15,
          reasoning: `AI recommends ${doctor.specialization} for your symptoms: "${searchQuery}"`
        }
      }));
      
      results.sort((a, b) => b.aiMatch.matchScore - a.aiMatch.matchScore);
      
    } else {
      // Regular search by name, specialization, or city
      results = allDoctors.filter(doctor => {
        const doctorName = doctor.userId?.name || '';
        const specialization = doctor.specialization || '';
        const city = doctor.location?.city || '';
        
        return doctorName.toLowerCase().includes(searchLower) ||
               specialization.toLowerCase().includes(searchLower) ||
               city.toLowerCase().includes(searchLower);
      });
    }
    
    console.log(`AI Search found ${results.length} doctors (${isSymptomSearch ? 'symptom' : 'regular'} search)`);
    res.json(results);
    
  } catch (error) {
    console.error('AI Search error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;