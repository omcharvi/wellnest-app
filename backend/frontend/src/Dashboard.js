
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const cards = [
    { title: '😊 Mood Tracker', desc: 'Log and track your daily mood', path: '/mood' },
    { title: '📝 Journal', desc: 'Write and reflect with AI prompts', path: '/journal' },
    { title: '📊 Analytics', desc: 'View your mood trends and insights', path: '/analytics' },
    { title: '💬 AI Chat', desc: 'Talk to your AI companion', path: '/chat' },
    { title: '📄 Reports', desc: 'Export your wellness reports', path: '/reports' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🌿 WellNest</h1>
        <button style={styles.logout} onClick={handleLogout}>Logout</button>
      </div>
      <p style={styles.welcome}>Welcome back! How are you feeling today?</p>
      <div style={styles.grid}>
        {cards.map((card, i) => (
          <Link to={card.path} key={i} style={styles.card}>
            <h2 style={styles.cardTitle}>{card.title}</h2>
            <p style={styles.cardDesc}>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f1923', padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '8px' },
  title: { color: '#4ecdc4', margin: 0 },
  welcome: { color: '#8899aa', marginBottom: '32px' },
  logout: { background: '#ff6b6b', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px' },
  card: { background: '#1a2634', padding: '24px', borderRadius: '16px',
    textDecoration: 'none', display: 'block',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)', transition: 'transform 0.2s' },
  cardTitle: { color: '#4ecdc4', marginBottom: '8px', fontSize: '18px' },
  cardDesc: { color: '#8899aa', fontSize: '14px', margin: 0 },
};