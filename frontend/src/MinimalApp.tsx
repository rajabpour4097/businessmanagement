import React, { useState } from 'react';

// ساده‌ترین نسخه ممکن از App
const MinimalApp = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState<any>(null);

  const handleLogin = (username: string, password: string) => {
    if (username && password) {
      setUser({ 
        username, 
        role: username === 'admin' ? 'management' : 'accounting',
        full_name: username === 'admin' ? 'مدیر سیستم' : 'حسابدار'
      });
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  if (currentPage === 'login') {
    return <LoginComponent onLogin={handleLogin} />;
  }

  return <DashboardComponent user={user} onLogout={handleLogout} onNavigate={setCurrentPage} currentPage={currentPage} />;
};

// کامپوننت ورود ساده
const LoginComponent = ({ onLogin }: { onLogin: (u: string, p: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      direction: 'rtl',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ 
          marginBottom: '1.5rem', 
          textAlign: 'center', 
          fontSize: '24px',
          color: '#1f2937'
        }}>
          🔐 ورود به سیستم مدیریت
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              نام کاربری:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="admin یا accounting"
              required
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              رمز عبور:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="رمز عبور"
              required
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
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            ورود
          </button>
        </form>
        
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#0369a1'
        }}>
          <strong>حساب‌های تست:</strong><br />
          مدیر: admin / admin123<br />
          حسابدار: accounting / acc123
        </div>
      </div>
    </div>
  );
};

// کامپوننت داشبورد ساده
const DashboardComponent = ({ 
  user, 
  onLogout, 
  onNavigate, 
  currentPage 
}: { 
  user: any; 
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}) => {
  const menuItems = [
    { id: 'dashboard', label: '📊 داشبورد', requiresAccounting: false },
    { id: 'accounts', label: '💰 حساب‌ها', requiresAccounting: true },
    { id: 'overdue', label: '⚠️ معوقات', requiresAccounting: true },
    { id: 'reports', label: '📈 گزارش‌ها', requiresAccounting: true },
  ];

  const hasAccountingAccess = user?.role === 'management' || user?.role === 'accounting';

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <h1 style={{ fontSize: '20px', margin: 0, color: '#1f2937' }}>
          پنل مدیریت کسب و کار
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#6b7280' }}>
            خوش آمدید، {user?.full_name || user?.username}
          </span>
          <span style={{ 
            padding: '0.25rem 0.5rem',
            backgroundColor: user?.role === 'management' ? '#dbeafe' : '#fef3c7',
            color: user?.role === 'management' ? '#1e40af' : '#92400e',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            {user?.role === 'management' ? 'مدیر' : 'حسابدار'}
          </span>
          <button
            onClick={onLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            خروج
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        {/* Sidebar */}
        <div style={{
          width: '250px',
          backgroundColor: 'white',
          borderLeft: '1px solid #e5e7eb',
          padding: '1rem'
        }}>
          <nav>
            {menuItems.map(item => {
              if (item.requiresAccounting && !hasAccountingAccess) return null;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    marginBottom: '0.5rem',
                    textAlign: 'right',
                    backgroundColor: currentPage === item.id ? '#eff6ff' : 'transparent',
                    color: currentPage === item.id ? '#2563eb' : '#374151',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: currentPage === item.id ? '500' : 'normal'
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ 
          flex: 1, 
          padding: '2rem',
          backgroundColor: '#f9fafb',
          overflow: 'auto'
        }}>
          {currentPage === 'dashboard' && <DashboardContent user={user} />}
          {currentPage === 'accounts' && <AccountsContent />}
          {currentPage === 'overdue' && <OverdueContent />}
          {currentPage === 'reports' && <ReportsContent />}
        </div>
      </div>
    </div>
  );
};

// محتوای داشبورد
const DashboardContent = ({ user }: { user: any }) => (
  <div>
    <h2 style={{ fontSize: '24px', marginBottom: '1rem', color: '#1f2937' }}>
      داشبورد {user?.role === 'management' ? 'مدیریت' : 'حسابداری'}
    </h2>
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      {[
        { title: 'کل حساب‌ها', value: '25', icon: '💰', color: '#3b82f6' },
        { title: 'معوقات', value: '5', icon: '⚠️', color: '#ef4444' },
        { title: 'چک‌ها', value: '12', icon: '📝', color: '#8b5cf6' },
        { title: 'پیگیری‌ها', value: '8', icon: '📞', color: '#10b981' }
      ].map((stat, index) => (
        <div key={index} style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                {stat.title}
              </p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color, margin: 0 }}>
                {stat.value}
              </p>
            </div>
            <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
    
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>فعالیت‌های اخیر</h3>
      <ul style={{ margin: 0, paddingRight: '1rem', color: '#6b7280' }}>
        <li style={{ marginBottom: '0.5rem' }}>حساب جدید ABC ثبت شد</li>
        <li style={{ marginBottom: '0.5rem' }}>پیگیری با شرکت XYZ انجام شد</li>
        <li style={{ marginBottom: '0.5rem' }}>گزارش ماهانه تهیه شد</li>
      </ul>
    </div>
  </div>
);

// محتوای صفحات دیگر
const AccountsContent = () => (
  <div>
    <h2 style={{ fontSize: '24px', marginBottom: '1rem', color: '#1f2937' }}>
      مدیریت حساب‌ها
    </h2>
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💰</div>
      <p style={{ fontSize: '18px', color: '#6b7280' }}>
        صفحه مدیریت حساب‌ها در حال توسعه است
      </p>
    </div>
  </div>
);

const OverdueContent = () => (
  <div>
    <h2 style={{ fontSize: '24px', marginBottom: '1rem', color: '#1f2937' }}>
      حساب‌های معوق
    </h2>
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
      <p style={{ fontSize: '18px', color: '#6b7280' }}>
        صفحه حساب‌های معوق در حال توسعه است
      </p>
    </div>
  </div>
);

const ReportsContent = () => (
  <div>
    <h2 style={{ fontSize: '24px', marginBottom: '1rem', color: '#1f2937' }}>
      گزارش‌ها
    </h2>
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📈</div>
      <p style={{ fontSize: '18px', color: '#6b7280' }}>
        صفحه گزارش‌ها در حال توسعه است
      </p>
    </div>
  </div>
);

export default MinimalApp;
