// pages/admin/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/admin/AdminLogin.module.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
    } else {
      localStorage.setItem('token', data.token);
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className={styles.adminLoginContainer}>
      <div className={styles.adminLoginWrapper}>
        <div className={styles.adminLoginImage}>
          <img
            src="/admin_logo.png"
            alt="Admin Login Illustration"
          />
        </div>
        <div className={styles.adminLoginForm}>
          <h1 className={styles.pageTitle}>Admin Login</h1>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;