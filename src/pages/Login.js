import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';
// 
export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const storedUsers = localStorage.getItem('registeredUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const existingUser = users.find(
      (user) =>
        (user.email === identifier || user.username === identifier) &&
        user.password === password
    );

    if (!existingUser) {
      toast.error('Invalid email/username or password.', {
        position: 'top-right',
        autoClose: 3000,
        pauseOnHover: true,
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    toast.success('Login successful! Redirecting...', {
      position: 'top-right',
      autoClose: 2000,
      pauseOnHover: false,
    });

    login(existingUser);

    setTimeout(() => {
      navigate('/dashboard');
    }, 2000); // Wait for toast to finish
  };

  return (
    <div className="form-container">
      <ToastContainer />
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className={shake ? 'error-input' : ''}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={shake ? 'error-input' : ''}
          required
        />
        <button type="submit">Login</button>
      </form>
      <br />
      <div className="form-footer-links">
        <p className="form-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <p className="form-footer">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}