import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';
import EventPass from './components/EventPass';
import ProfilePage from './components/ProfilePage';
import NotFound from './components/NotFound'; 
import AdminPage from './components/AdminPage';
import AdminGate from './components/AdminGate';
import Notifications from './components/Notifications';

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const token = localStorage.getItem("userToken");

  // 1. Define which roles are allowed in this area
  const allowedRoles = ['admin', 'moderator'];
  // 2. Check if user is authenticated and has the right role
  if (!token || !allowedRoles.includes(user.role)) {
    alert("Restricted Area!! 🔴");
    return <Navigate to="/" replace />;
  }

  return children;

};

function App() {
  return (
    <Router>
        <Notifications />

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register/:eventID" element={<EventPass />} />
        
        {/* Admin Route Protected */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminGate>
            <AdminPage />
            </AdminGate>
          </AdminRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>

  );
}

export default App;