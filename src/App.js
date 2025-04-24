// Micromatching Enhanced Frontend App.js
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

function App() {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('micromatching-history')) || [];
    setHistory(stored);
  }, []);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await fetch('https://micromatching-backend.onrender.com/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.replace('@', '') })
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
        const newHistory = [username, ...history.filter(u => u !== username)].slice(0, 3);
        setHistory(newHistory);
        localStorage.setItem('micromatching-history', JSON.stringify(newHistory));
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 font-sans">
      <header className="text-center mb-10">
        <img src="/logo.png" alt="Micromatching" className="h-24 mx-auto mb-4 drop-shadow-md" />
        <h1 className="text-4xl font-bold text-gray-800">Instagram Engagement Rate Checker</h1>
        <p className="text-gray-500">Powered by Micromatching 🚀</p>
      </header>

      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
        <input
          type="text"
          placeholder="Enter Instagram Username (e.g. cristiano)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          className="w-full mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          onClick={handleCheck}
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Engagement"}
        </button>

        {history.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            <p className="font-semibold mb-1">Recent Searches:</p>
            <div className="flex gap-2">
              {history.map((item, i) => (
                <button
                  key={i}
                  className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  onClick={() => setUsername(item)}
                >@{item}</button>
              ))}
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl shadow-sm text-gray-800 space-y-2">
            <p><strong>Followers:</strong> {result.followers}</p>
            <p><strong>Avg Likes:</strong> {result.avg_likes}</p>
            <p><strong>Avg Comments:</strong> {result.avg_comments}</p>
            <p><strong>Engagement Rate:</strong> {result.engagement_rate}%</p>
            <p><strong>Tier:</strong> {result.tier}</p>

            <div className="mt-6">
              <p className="font-semibold mb-2">Visual Breakdown:</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: 'Likes', value: result.avg_likes },
                  { name: 'Comments', value: result.avg_comments },
                ]}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
