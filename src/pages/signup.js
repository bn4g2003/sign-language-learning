// pages/signup.js
import { signUp } from '@/utils/auth';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/Auth.module.css';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const { user, error } = await signUp(email, password);
    if (error) {
      console.error('Error signing up:', error);
      setError(error.message || 'An error occurred during sign up');
    } else {
      console.log('Signed up successfully!', user);
      alert('Kiểm tra email của bạn');
      router.push('/login');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authWrapper}>
        <div className={styles.authImage}>
          <img
            src="/auth_logo.png" 
            alt="Sign Up Illustration"
          />
        </div>
        <div className={styles.authForm}>
          <h1 className={styles.pageTitle}>Sign Up</h1>
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.inputField}
          />
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button onClick={handleSignUp} className={styles.authButton}>
            Sign Up
          </button>
          <p className={styles.authLink}>
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}