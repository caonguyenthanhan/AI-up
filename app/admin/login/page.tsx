'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Đăng nhập thất bại');
        setLoading(false);
        return;
      }

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      console.error('[v0] Login error:', err);
      setError('Lỗi kết nối. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">AI-up Admin</h1>
          <p className="text-on-surface-variant">Quản lý bài viết và AI Assistant</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-surface-container rounded-2xl p-8 border border-outline-variant/30"
        >
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-on-surface mb-2">
              Mật khẩu Admin
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-error-container/20 border border-error/30 text-error text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full px-4 py-3 rounded-lg bg-primary text-on-primary font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>

          <p className="text-xs text-on-surface-variant text-center mt-4">
            Đây là khu vực dành riêng cho quản trị viên
          </p>
        </form>
      </div>
    </div>
  );
}
