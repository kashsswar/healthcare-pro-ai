import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import io from 'socket.io-client';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DoctorList from './pages/DoctorList';
import BookAppointment from './pages/BookAppointment';
import AppointmentQueue from './pages/AppointmentQueue';
import HealthRecommendations from './pages/HealthRecommendations';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import MarketingWidget from './pages/MarketingWidget';
import EmbedWidget from './pages/EmbedWidget';
import ContactUs from './pages/ContactUs';
import ShippingPolicy from './pages/ShippingPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CancellationRefund from './pages/CancellationRefund';
import PrivacyPolicy from './pages/PrivacyPolicy';
import VoiceAssistant from './components/VoiceAssistant';
import VisualHealthAlerts from './components/VisualHealthAlerts';
import AccessibilityPanel from './components/AccessibilityPanel';

const theme = createTheme({
  palette: {
    primary: { main: '#2196f3' },
    secondary: { main: '#f50057' },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      
      // Initialize socket connection with fallback
      try {
        const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
          timeout: 5000,
          transports: ['websocket', 'polling']
        });
        setSocket(newSocket);
        return () => newSocket.close();
      } catch (error) {
        console.log('Socket connection failed, continuing without real-time updates');
      }
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    try {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        timeout: 5000,
        transports: ['websocket', 'polling']
      });
      setSocket(newSocket);
    } catch (error) {
      console.log('Socket connection failed during login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (socket) {
      try {
        socket.close();
      } catch (error) {
        console.log('Socket cleanup error:', error);
      }
    }
    setSocket(null);
  };

  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            {user && <Navbar user={user} onLogout={handleLogout} />}
          
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/secret-admin-portal-2024" 
              element={<AdminLogin onAdminLogin={handleLogin} />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard key={Date.now()} user={user} socket={socket} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/doctors" 
              element={user ? <DoctorList user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/book-appointment/:doctorId" 
              element={user ? <BookAppointment user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/queue/:doctorId" 
              element={user ? <AppointmentQueue user={user} socket={socket} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/health-recommendations" 
              element={user ? <HealthRecommendations user={user} /> : <Navigate to="/login" />} 
            />

            <Route 
              path="/admin" 
              element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/secret-admin-portal-2024" />} 
            />
            <Route 
              path="/marketing-widget" 
              element={<MarketingWidget />} 
            />
            <Route 
              path="/embed" 
              element={<EmbedWidget />} 
            />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/cancellation-refund" element={<CancellationRefund />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
          
          {user && (
            <>
              <VoiceAssistant />
              {user.role !== 'doctor' && user.role !== 'Doctor' && !user.specialization && <VisualHealthAlerts />}
              <AccessibilityPanel />
            </>
          )}
          <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;