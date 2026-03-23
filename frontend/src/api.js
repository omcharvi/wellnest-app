
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

// Example: fetch dashboard data
export const getDashboardData = async (token) => {
  try {
    const response = await axios.get(`${API}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
// ✅ Mood APIs
export const getMood = async (token) => {
  const res = await fetch(`${BASE_URL}/mood`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const updateMood = async (mood, token) => {
  const res = await fetch(`${BASE_URL}/mood`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mood }),
  });
  return res.json();
};