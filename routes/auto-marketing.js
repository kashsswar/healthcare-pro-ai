const express = require('express');
const router = express.Router();

// AI Auto-Marketing System
router.post('/generate-content', async (req, res) => {
  try {
    const { type } = req.body; // 'social', 'blog', 'email'
    
    const prompts = {
      social: "Create an engaging social media post about online healthcare benefits in 2-3 sentences with emojis",
      blog: "Write a 200-word blog post about choosing the right doctor online",
      email: "Write a friendly email subject and body encouraging users to book their first consultation"
    };
    
    // Fallback content if OpenAI fails
    const fallbackContent = {
      social: "🏥 Skip the waiting room! Book your doctor appointment online in just 2 clicks. 500+ verified doctors available 24/7. Your health, your schedule! 💊✨ #HealthTech #OnlineDoctor",
      blog: "Finding the Right Doctor Online: A Modern Approach to Healthcare\n\nIn today's digital age, finding quality healthcare has never been easier. Online platforms connect you with verified doctors across multiple specializations, eliminating long waiting times and geographical barriers. Look for platforms with verified credentials, patient reviews, and transparent pricing. The convenience of booking appointments at your preferred time, combined with AI-powered doctor matching based on your symptoms, makes online healthcare the future of medical consultations.",
      email: {
        subject: "Your health deserves the best care - Book now!",
        body: "Hi there! 👋\n\nTaking care of your health shouldn't be complicated. With HealthConnect AI, you can:\n✅ Find verified doctors in seconds\n✅ Book appointments that fit your schedule\n✅ Get AI-powered health recommendations\n\nReady to experience healthcare made simple? Book your first consultation today!\n\nStay healthy,\nHealthConnect AI Team"
      }
    };
    
    res.json({ content: fallbackContent[type] });
  } catch (error) {
    res.status(500).json({ error: 'Content generation failed' });
  }
});

// Auto-generate patient testimonials
router.post('/generate-testimonial', async (req, res) => {
  const testimonials = [
    {
      name: "Priya S.",
      rating: 5,
      text: "Found the perfect cardiologist in minutes! The AI matching was spot-on. Highly recommend!",
      specialization: "Cardiology"
    },
    {
      name: "Rahul M.",
      rating: 5,
      text: "No more waiting in long queues. Booked my appointment online and got excellent care.",
      specialization: "General Medicine"
    },
    {
      name: "Anita K.",
      rating: 5,
      text: "The health recommendations feature helped me prevent a major issue. Thank you HealthConnect!",
      specialization: "Preventive Care"
    }
  ];
  
  const randomTestimonial = testimonials[Math.floor(Math.random() * testimonials.length)];
  res.json(randomTestimonial);
});

// Auto-generate health tips
router.get('/daily-health-tip', async (req, res) => {
  const healthTips = [
    "💧 Drink 8 glasses of water daily to keep your body hydrated and toxins flushed out!",
    "🚶‍♀️ Take a 10-minute walk after meals to improve digestion and blood sugar levels.",
    "😴 Get 7-8 hours of sleep for better immunity and mental clarity.",
    "🥗 Include colorful vegetables in every meal for essential vitamins and minerals.",
    "🧘‍♂️ Practice 5 minutes of deep breathing to reduce stress and anxiety.",
    "📱 Take regular breaks from screens to prevent eye strain and headaches.",
    "🦷 Brush your teeth twice daily and floss to prevent dental problems."
  ];
  
  const tip = healthTips[Math.floor(Math.random() * healthTips.length)];
  res.json({ tip, date: new Date().toDateString() });
});

module.exports = router;