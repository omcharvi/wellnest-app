
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer } from 'recharts';

const API = process.env.REACT_APP_API_URL;
const token = () => localStorage.getItem('token');

export default function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API}/analytics/mood`,
          { headers: { Authorization: `Bearer ${token()}` } }
        );
        setData(res.data);
      } catch (err) { console.error(err); }
    };
    fetchAnalytics();
  }, []);

  const avg = data.length
    ? (data.reduce((s, d) => s + d.mood_score, 0) / data.length).toFixed(1)
    : 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/dashboard" style={styles.back}>← Back</Link>
        <h2 style={styles.title}>📊 Analytics</h2>
      </div>
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statValue}>{data.length}</p>
          <p style={styles.statLabel}>Total Logs</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statValue}>{avg}</p>
          <p style={styles.statLabel}>Avg Mood</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statValue}>{data.length > 0 ? data[data.length-1].mood_score : '-'}</p>
          <p style={styles.statLabel}>Latest Mood</p>
        </div>
      </div>
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Mood Trend (Last 30 Days)</h3>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3a4a" />
              <XAxis dataKey="date" stroke="#8899aa" tick={{ fontSize: 11 }} />
              <YAxis domain={[1, 10]} stroke="#8899aa" />
              <Tooltip contentStyle={{ background: '#1a2634', border: 'none', color: '#fff' }} />
              <Line type="monotone" dataKey="mood_score"
                stroke="#4ecdc4" strokeWidth={2} dot={{ fill: '#4ecdc4' }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p style={styles.noData}>No mood data yet. Start tracking your mood! 😊</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f1923', padding: '24px', maxWidth: '700px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  back: { color: '#4ecdc4', textDecoration: 'none' },
  title: { color: '#4ecdc4', margin: 0 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#1a2634', padding: '20px', borderRadius: '12px', textAlign: 'center' },
  statValue: { color: '#4ecdc4', fontSize: '32px', fontWeight: 'bold', margin: 0 },
  statLabel: { color: '#8899aa', fontSize: '14px', marginTop: '4px', marginBottom: 0 },
  chartCard: { background: '#1a2634', padding: '24px', borderRadius: '16px' },
  chartTitle: { color: '#fff', marginBottom: '20px' },
  noData: { color: '#8899aa', textAlign: 'center', padding: '40px 0' },
};