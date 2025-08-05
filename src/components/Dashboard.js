import React from 'react';
import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Reusable Navbar component
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="form-box">
        <h2>Welcome, {user?.fullName}!</h2>
        <p>Email: {user?.email}</p>
      </div>
    </>
  );
}