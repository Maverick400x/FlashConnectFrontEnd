import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/register.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(''); // 'weak', 'medium', 'strong'

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

  const handleRegister = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    const emailExists = users.some(user => user.email === email);
    const usernameExists = users.some(user => user.username === username);

    if (emailExists) {
      toast.error('This email is already registered.');
      return;
    }

    if (usernameExists) {
      toast.error('This username is already taken.');
      return;
    }

    if (passwordStrength === 'weak') {
      toast.error('Please choose a stronger password.');
      return;
    }

    const newUser = { fullName, username, email, password };
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    toast.success('Registration successful! Redirecting to login...');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="form-container">
      <ToastContainer position="top-right" autoClose={2000} />
      
      <h2>Register</h2>
      <form className="auth-form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
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

        {/* Password Strength Bar */}
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