import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = { email, password };

    try {
      const res = await fetch('http://localhost:8081/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.message || 'Invalid email or password.', {
          position: 'top-right',
          autoClose: 3000,
          pauseOnHover: true
        });
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }

      const data = await res.json(); // This should be UserResponseDTO
      login(data);

      toast.success('Login successful! Redirecting...', {
        position: 'top-right',
        autoClose: 2000,
        pauseOnHover: false
      });

      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong during login.');
    }
  };

  return (
    <div className="form-container">
      <ToastContainer />
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={shake ? 'error-input' : ''}
          required
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={shake ? 'error-input' : ''}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label="Toggle Password Visibility"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
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