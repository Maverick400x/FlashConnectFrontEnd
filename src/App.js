import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './components/Dashboard';
import ForgotPassword from './pages/ForgotPassword'; // ✅ Import the forgot password page
import Messages from "./pages/Messages";

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
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ New Route */}
          <Route path="/messages" element={<Messages />} />

          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />

          {/* Redirect all other paths to dashboard if user is logged in, else to login */}
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