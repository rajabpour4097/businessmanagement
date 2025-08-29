import React from 'react';

const TestApp = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>
        تست داشبورد مدیریت
      </h1>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '16px', color: '#666' }}>
          اگر این متن را می‌بینید، React به درستی کار می‌کند!
        </p>
        <button 
          style={{ 
            marginTop: '10px', 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => alert('دکمه کار می‌کند!')}
        >
          کلیک کنید
        </button>
      </div>
    </div>
  );
};

export default TestApp;
