'use client';
import { useState } from 'react';
import axios from 'axios';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Replace this with your actual backend API
      const baseUrl = process.env.BE_BASE_URL || 'http://localhost:5010';
      const res = await axios.post(`${baseUrl}/api/admin/login`, { email, password });

      if (res.status !== 200) throw new Error(res.data.message || 'Login failed');

    // Show a toast notification instead of alert
    if (typeof window !== 'undefined' && window?.Toastify) {
      window.Toastify({
        text: "Login successful! 🎉",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#22c55e",
      }).showToast();
    }
    // Redirect or save token here
    window.location.href = '/adminpage';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] transition-all">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md dark:bg-slate-800/50 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-[var(--foreground)] mb-6">
          Admin Login
        </h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-sm rounded-md p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 dark:border-slate-600 bg-transparent text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 dark:border-slate-600 bg-transparent text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center text-[var(--foreground)] mt-6">
          Forgot password?{' '}
          <a href="#" className="text-blue-500 hover:underline">
            Reset here
          </a>
        </p>
      </div>
    </div>
  );
}
