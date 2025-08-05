import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/register.css';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
      alert('This email is already registered.');
      return;
    }

    const newUser = { fullName, username, email, password };
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    alert('Registration successful!');
    navigate('/login');
  };

  return (
    <div className="form-container">
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
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p className="form-footer">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}