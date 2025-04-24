import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <img src="/logo.png" alt="Micromatching" className="h-28 md:h-36 w-auto mb-8 drop-shadow-lg" />
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
        Instagram Engagement Rate Checker
      </h1>

      <div className="w-full max-w-md">
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

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        {result && (
          <div className="mt-6 p-4 bg-white rounded-xl shadow-md text-gray-800 space-y-2">
            <p><strong>Followers:</strong> {result.followers}</p>
            <p><strong>Avg Likes:</strong> {result.avg_likes}</p>
            <p><strong>Avg Comments:</strong> {result.avg_comments}</p>
            <p><strong>Engagement Rate:</strong> {result.engagement_rate}%</p>
            <p><strong>Tier:</strong> {result.tier}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
