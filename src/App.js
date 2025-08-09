import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Messages from "./pages/Messages";
import Profile from "./pages/Profile"; 
import Help from "./pages/Help";

import { AuthProvider, useAuth } from './context/AuthContext';

// ✅ Protected route wrapper
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route 
            path="/messages" 
            element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />

          {/* ✅ Profile route */}
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />

          {/* ✅ Help route */}
          <Route 
            path="/help" 
            element={
              <PrivateRoute>
                <Help />
              </PrivateRoute>
            } 
          />
          
          {/* Redirect all other paths to dashboard if logged in, else login */}
          <Route 
            path="*" 
            element={
              <PrivateRoute>
                <Navigate to="/dashboard" />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;