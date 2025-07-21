import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import io from 'socket.io-client';
import { LanguageProvider } from './utils/languageContext';
import Navbar from './components/Navbar';
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
      
      // Initialize socket connection
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);
      
      return () => newSocket.close();
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (socket) socket.close();
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
              element={user ? <Dashboard user={user} socket={socket} /> : <Navigate to="/login" />} 
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
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
          
          {user && (
            <>
              <VoiceAssistant />
              <VisualHealthAlerts />
              <AccessibilityPanel />
            </>
          )}
          </div>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;