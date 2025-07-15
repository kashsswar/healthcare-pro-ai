// Simple analytics tracking
export const trackEvent = (eventName, properties = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }
  
  // Also log to console for debugging
  console.log('Analytics Event:', eventName, properties);
};

export const trackPageView = (pageName) => {
  trackEvent('page_view', { page_name: pageName });
};

export const trackUserAction = (action, category = 'user') => {
  trackEvent(action, { event_category: category });
};