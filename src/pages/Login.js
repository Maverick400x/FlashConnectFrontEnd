import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

export default function Login() {
  const [identifier, setIdentifier] = useState(''); // Email or username
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // Find user by matching email OR username AND password
    const existingUser = users.find(
      (user) =>
        (user.email === identifier || user.username === identifier) &&
        user.password === password
    );

    if (!existingUser) {
      alert('Invalid email/username or password. Please try again.');
      return;
    }

    login(existingUser); // Set auth context
    navigate('/dashboard'); // Navigate after successful login
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p className="form-footer">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <p className='form-footer'>
        Forgot Password?
      </p>
    </div>
  );
}