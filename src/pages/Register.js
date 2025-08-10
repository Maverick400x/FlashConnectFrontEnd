import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/register.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Register() {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  const checkPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*\d).{6,}$/;

    if (strongRegex.test(password)) return 'strong';
    else if (mediumRegex.test(password)) return 'medium';
    else return 'weak';
  };

  const getStrengthStyle = (strength) => {
    switch (strength) {
      case 'strong':
        return { width: '100%', backgroundColor: 'green' };
      case 'medium':
        return { width: '66%', backgroundColor: 'orange' };
      case 'weak':
        return { width: '33%', backgroundColor: 'red' };
      default:
        return { width: '0%', backgroundColor: 'transparent' };
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (passwordStrength === 'weak') {
      toast.error('Please choose a stronger password.');
      return;
    }

    const payload = { name, email, password, designation };

    try {
      const res = await fetch('http://localhost:8081/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.message || 'Registration failed');
        return;
      }

      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong during registration.');
    }
  };

  return (
    <div className="form-container">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2>Register</h2>
      <form className="auth-form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={e => setDesignation(e.target.value)}
          required
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(prev => !prev)}
            aria-label="Toggle password visibility"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        {password && (
          <div className="password-strength-bar">
            <div className="bar" style={getStrengthStyle(passwordStrength)}></div>
            <span className="strength-label">{passwordStrength.toUpperCase()}</span>
          </div>
        )}

        <button type="submit">Register</button>
      </form>
      <p className="form-footer">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}