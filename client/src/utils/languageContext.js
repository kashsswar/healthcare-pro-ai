import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    doctors: 'Doctors',
    appointments: 'Appointments',
    profile: 'Profile',
    logout: 'Logout',
    
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    
    // Doctor related
    findDoctor: 'Find Doctor',
    bookAppointment: 'Book Appointment',
    doctorProfile: 'Doctor Profile',
    specialization: 'Specialization',
    experience: 'Experience',
    rating: 'Rating',
    consultationFee: 'Consultation Fee',
    
    // Appointment related
    appointmentBooked: 'Appointment Booked Successfully',
    appointmentTime: 'Appointment Time',
    symptoms: 'Symptoms',
    
    // Search
    searchPlaceholder: 'Search doctors by name, specialization, or location',
    symptomsPlaceholder: 'Describe your symptoms (e.g., fever, headache)',
    symptomsHelper: 'AI will match you with the right specialist',
    aiSearch: 'AI Search'
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    doctors: 'डॉक्टर',
    appointments: 'अपॉइंटमेंट',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    
    // Common
    loading: 'लोड हो रहा है...',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    delete: 'डिलीट करें',
    edit: 'एडिट करें',
    search: 'खोजें',
    
    // Doctor related
    findDoctor: 'डॉक्टर खोजें',
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    doctorProfile: 'डॉक्टर प्रोफाइल',
    specialization: 'विशेषज्ञता',
    experience: 'अनुभव',
    rating: 'रेटिंग',
    consultationFee: 'परामर्श शुल्क',
    
    // Appointment related
    appointmentBooked: 'अपॉइंटमेंट सफलतापूर्वक बुक हो गया',
    appointmentTime: 'अपॉइंटमेंट का समय',
    symptoms: 'लक्षण',
    
    // Search
    searchPlaceholder: 'नाम, विशेषज्ञता या स्थान से डॉक्टर खोजें',
    symptomsPlaceholder: 'अपने लक्षण बताएं (जैसे बुखार, सिरदर्द)',
    symptomsHelper: 'AI आपको सही विशेषज्ञ से मिलाएगा',
    aiSearch: 'AI खोज'
  },
  es: {
    // Navigation
    dashboard: 'Panel de Control',
    doctors: 'Doctores',
    appointments: 'Citas',
    profile: 'Perfil',
    logout: 'Cerrar Sesión',
    
    // Common
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    search: 'Buscar',
    
    // Doctor related
    findDoctor: 'Encontrar Doctor',
    bookAppointment: 'Reservar Cita',
    doctorProfile: 'Perfil del Doctor',
    specialization: 'Especialización',
    experience: 'Experiencia',
    rating: 'Calificación',
    consultationFee: 'Tarifa de Consulta',
    
    // Appointment related
    appointmentBooked: 'Cita Reservada Exitosamente',
    appointmentTime: 'Hora de la Cita',
    symptoms: 'Síntomas',
    
    // Search
    searchPlaceholder: 'Buscar doctores por nombre, especialización o ubicación',
    symptomsPlaceholder: 'Describe tus síntomas (ej. fiebre, dolor de cabeza)',
    symptomsHelper: 'La IA te conectará con el especialista correcto',
    aiSearch: 'Búsqueda IA'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
    }
  };

  const t = (key) => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};