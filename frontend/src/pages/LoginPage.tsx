import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('لطفا نام کاربری و رمز عبور را وارد کنید');
      setIsLoading(false);
      return;
    }

    try {
      await login(username.trim(), password);
      // Navigate will happen automatically when auth state changes
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.data?.non_field_errors) {
        setError(err.response.data.non_field_errors[0]);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('خطا در ورود به سیستم. لطفا دوباره تلاش کنید.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            ورود به داشبورد مدیریت
          </h2>
          <p className="mt-2 text-gray-600">
            لطفا اطلاعات خود را وارد کنید
          </p>
        </div>
        <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              نام کاربری
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="نام کاربری"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              رمز عبور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-md">
              <div className="text-red-700">{error}</div>
            </div>
          )}

          <div className="mb-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary"
            >
              {isLoading ? 'در حال ورود...' : 'ورود'}
            </button>
          </div>

          <div className="text-center text-gray-600">
            <p className="mb-2">حساب‌های آزمایشی:</p>
            <p><strong>مدیر:</strong> admin / admin123</p>
            <p><strong>حسابدار:</strong> accounting / acc123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
