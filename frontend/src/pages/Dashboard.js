import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDashboardData } from '../services/api'; 

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null); // API data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Fetch dashboard data on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // redirect if no token
      return;
    }

    getDashboardData(token)
      .then((res) => {
        setData(res); // Save API response
        setError('');
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load dashboard data.');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const cards = [
    { title: '😊 Mood Tracker', desc: 'Log and track your daily mood', path: '/mood' },
    { title: '📝 Journal', desc: 'Write and reflect with AI prompts', path: '/journal' },
    { title: '📊 Analytics', desc: 'View your mood trends and insights', path: '/analytics' },
    { title: '💬 AI Chat', desc: 'Talk to your AI companion', path: '/chat' },
    { title: '📄 Reports', desc: 'Export your wellness reports', path: '/reports' },
  ];

  if (loading) return <p style={{ color: '#fff' }}>Loading dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🌿 WellNest</h1>
        <button style={styles.logout} onClick={handleLogout}>Logout</button>
      </div>

      <p style={styles.welcome}>Welcome back! How are you feeling today?</p>

      {/* Example of showing some API data */}
      {data && (
        <div style={{ color: '#fff', marginBottom: '20px' }}>
          <h3>Dashboard Stats:</h3>
          <p>Moods Logged: {data.moodsCount || 0}</p>
          <p>Journal Entries: {data.journalCount || 0}</p>
        </div>
      )}

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

// Styles remain the same
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
