import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Simple Login Component
const SimpleLogin = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin({ username, role: username === 'admin' ? 'management' : 'accounting' });
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      direction: 'rtl'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '24px' }}>
          ورود به سیستم
        </h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>نام کاربری:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="admin یا accounting"
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>رمز عبور:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="هر چیزی"
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            ورود
          </button>
        </form>
      </div>
    </div>
  );
};

// Simple Dashboard Component
const SimpleDashboard = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  return (
    <div style={{ direction: 'rtl' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '20px', margin: 0 }}>پنل مدیریت</h1>
        <div>
          <span style={{ marginLeft: '1rem' }}>خوش آمدید، {user.username}</span>
          <button
            onClick={onLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            خروج
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 80px)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '1rem' }}>
            داشبورد {user.role === 'management' ? 'مدیریت' : 'حسابداری'}
          </h2>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { title: 'تعداد حساب‌ها', value: '25', icon: '💰' },
            { title: 'حساب‌های معوقه', value: '5', icon: '⚠️' },
            { title: 'چک‌های سررسید', value: '8', icon: '📝' },
            { title: 'بدهی‌های جاری', value: '12', icon: '📊' }
          ].map((stat, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 0.5rem 0' }}>{stat.title}</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stat.value}</p>
                </div>
                <div style={{ fontSize: '32px' }}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '18px' }}>عملیات سریع</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['مدیریت حساب‌ها', 'ثبت مغایرت جدید', 'افزودن پیگیری'].map((action, index) => (
                <button
                  key={index}
                  style={{
                    padding: '0.75rem',
                    textAlign: 'right',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  → {action}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '18px' }}>گزارش‌ها</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['حساب‌های معوقه', 'چک‌های سررسید', 'بدهی‌های جاری'].map((report, index) => (
                <button
                  key={index}
                  style={{
                    padding: '0.75rem',
                    textAlign: 'right',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: '#dc2626'
                  }}
                >
                  → {report}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const SimpleApp = () => {
  const [user, setUser] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <SimpleLogin onLogin={handleLogin} />;
  }

  return <SimpleDashboard user={user} onLogout={handleLogout} />;
};

export default SimpleApp;
