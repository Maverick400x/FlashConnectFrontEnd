import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    const storedUsers = localStorage.getItem('registeredUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const updatedUsers = users.map((user) => {
      if (user.email === email) {
        return { ...user, password: newPassword };
      }
      return user;
    });

    const userExists = users.some((user) => user.email === email);

    if (!userExists) {
      setMessage('No account found with that email.');
      return;
    }

    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    setMessage('Password successfully updated. Redirecting to login...');

    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>
      <form className="auth-form" onSubmit={handleResetPassword}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Re-enter New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {message && <p className="form-message">{message}</p>}
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}