
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;
const token = () => localStorage.getItem('token');

export default function Reports() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const downloadReport = async (format) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/reports/export?format=${format}`, {
        headers: { Authorization: `Bearer ${token()}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `wellnest_report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage(`${format.toUpperCase()} downloaded successfully! ✅`);
    } catch (err) {
      setMessage('Failed to generate report ❌');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/dashboard" style={styles.back}>← Back</Link>
        <h2 style={styles.title}>📄 Wellness Reports</h2>
      </div>
      <div style={styles.card}>
        <p style={styles.desc}>
          Export your complete wellness data including mood history,
          journal entries, and AI insights.
        </p>
        {message && <p style={styles.message}>{message}</p>}
        <button style={styles.pdfBtn}
          onClick={() => downloadReport('pdf')} disabled={loading}>
          {loading ? 'Generating...' : '📥 Download PDF Report'}
        </button>
        <button style={styles.csvBtn}
          onClick={() => downloadReport('csv')} disabled={loading}>
          {loading ? 'Generating...' : '📥 Download CSV Report'}
        </button>
      </div>
      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>What's included in your report?</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>✅ Mood tracking history & trends</li>
          <li style={styles.listItem}>✅ Journal entries & AI summaries</li>
          <li style={styles.listItem}>✅ Coping strategies used</li>
          <li style={styles.listItem}>✅ Overall wellness insights</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f1923', padding: '24px', maxWidth: '600px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  back: { color: '#4ecdc4', textDecoration: 'none' },
  title: { color: '#4ecdc4', margin: 0 },
  card: { background: '#1a2634', padding: '24px', borderRadius: '16px', marginBottom: '20px' },
  desc: { color: '#8899aa', marginBottom: '24px', lineHeight: '1.6' },
  message: { color: '#4ecdc4', marginBottom: '16px' },
  pdfBtn: { width: '100%', padding: '14px', background: '#4ecdc4', color: '#0f1923',
    border: 'none', borderRadius: '8px', fontSize: '16px',
    fontWeight: 'bold', cursor: 'pointer', marginBottom: '12px' },
  csvBtn: { width: '100%', padding: '14px', background: 'transparent', color: '#4ecdc4',
    border: '2px solid #4ecdc4', borderRadius: '8px', fontSize: '16px',
    fontWeight: 'bold', cursor: 'pointer' },
  infoCard: { background: '#1a2634', padding: '24px', borderRadius: '16px' },
  infoTitle: { color: '#fff', marginBottom: '16px' },
  list: { paddingLeft: '0', listStyle: 'none', margin: 0 },
  listItem: { color: '#8899aa', marginBottom: '12px', fontSize: '14px' },
};