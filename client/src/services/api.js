import axios from 'axios';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const doctorAPI = {
  getAll: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  getAvailability: (id, date) => api.get(`/doctors/${id}/availability?date=${date}`),
};

export const appointmentAPI = {
  book: (appointmentData) => api.post('/appointments/book', appointmentData),
  getPatientAppointments: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getDoctorAppointments: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  bookSimple: (appointmentData) => api.post('/appointments/book-simple', appointmentData),
  startConsultation: (id) => api.patch(`/appointments/${id}/start`),
  completeConsultation: (id, data) => api.patch(`/appointments/${id}/complete`, data),
  getQueue: (doctorId) => api.get(`/appointments/queue/${doctorId}`),
};

export const aiAPI = {
  getHealthRecommendations: (userId) => api.post('/ai/health-recommendations', { userId }),
  analyzeSymptoms: (symptoms, patientHistory) => api.post('/ai/analyze-symptoms', { symptoms, patientHistory }),
  matchDoctor: (symptoms, location, preferences) => api.post('/ai/match-doctor', { symptoms, location, preferences }),
  predictDuration: (symptoms, doctorId, patientHistory) => api.post('/ai/predict-duration', { symptoms, doctorId, patientHistory }),
};

export default api;