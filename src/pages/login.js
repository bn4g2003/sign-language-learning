// pages/login.js
import { supabase } from '@/utils/auth';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/Auth.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Error logging in:', error);
      setError(error.message || 'An error occurred during login');
    } else {
      console.log('Logged in successfully!', user);
      router.push('/'); 
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authWrapper}>
        <div className={styles.authImage}>
          <img
            src="/auth_logo.png" 
            alt="Login Illustration"
          />
        </div>
        <div className={styles.authForm}>
          <h1 className={styles.pageTitle}>Login</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
          />
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button onClick={handleLogin} className={styles.authButton}>
            Login
          </button>
          <p className={styles.authLink}>
            Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}