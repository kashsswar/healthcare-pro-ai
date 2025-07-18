import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('healthcare-language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('healthcare-language', languageCode);
      
      // Update document direction for RTL languages
      if (['ar', 'he', 'ur'].includes(languageCode)) {
        document.dir = 'rtl';
      } else {
        document.dir = 'ltr';
      }
    }
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const getAvailableLanguages = () => {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
      { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
      { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
      { code: 'bn', name: 'বাংলা', flag: '🇮🇳' }
    ];
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    getAvailableLanguages,
    isRTL: ['ar', 'he', 'ur'].includes(currentLanguage)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};