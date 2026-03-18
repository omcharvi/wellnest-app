
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/login`,
        new URLSearchParams({ username: email, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌿 WellNest</h1>
        <p style={styles.subtitle}>Your AI Mental Health Companion</p>
        <form onSubmit={handleLogin}>
          <input style={styles.input} type="email" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.button} type="submit">Login</button>
        </form>
        <p style={styles.link}>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#0f1923' },
  card: { background: '#1a2634', padding: '40px', borderRadius: '16px',
    width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
  title: { color: '#4ecdc4', textAlign: 'center', marginBottom: '8px' },
  subtitle: { color: '#8899aa', textAlign: 'center', marginBottom: '24px' },
  input: { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px',
    border: '1px solid #2a3a4a', background: '#0f1923', color: '#fff',
    fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', background: '#4ecdc4', color: '#0f1923',
    border: 'none', borderRadius: '8px', fontSize: '16px',
    fontWeight: 'bold', cursor: 'pointer' },
  error: { color: '#ff6b6b', marginBottom: '12px', fontSize: '14px' },
  link: { color: '#8899aa', textAlign: 'center', marginTop: '16px', fontSize: '14px' }
};