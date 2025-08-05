import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import '../styles/login.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    const storedUsers = localStorage.getItem('registeredUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const userExists = users.some((user) => user.email === email);

    if (!userExists) {
      toast.error('No account found with that email.');
      return;
    }

    const updatedUsers = users.map((user) => {
      if (user.email === email) {
        return { ...user, password: newPassword };
      }
      return user;
    });

    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    toast.success('Password successfully updated. Redirecting to login...');

    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="form-container">
      <Toaster position="top-right" reverseOrder={false} />
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
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
