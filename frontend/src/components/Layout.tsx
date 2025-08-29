import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, hasManagementAccess, hasAccountingAccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    // Management-only items
    ...(hasManagementAccess() ? [
      { path: '/dashboard', label: 'داشبورد', icon: '🏠' },
      { path: '/users', label: 'مدیریت کاربران', icon: '👥' },
    ] : []),
    
    // Accounting accessible items
    ...(hasAccountingAccess() ? [
      { path: '/accounts', label: 'حساب‌ها', icon: '💰' },
      { path: '/overdue-accounts', label: 'حساب‌های معوقه', icon: '⚠️' },
      { path: '/discrepancies', label: 'مغایرت‌ها', icon: '🔍' },
      { path: '/follow-ups', label: 'پیگیری‌ها', icon: '📋' },
      { path: '/inventory-stats', label: 'آمار انبار', icon: '📦' },
      { path: '/tasks', label: 'لیست کارها', icon: '✅' },
      { path: '/payable-checks', label: 'چک‌های پرداختی', icon: '💳' },
      { path: '/receivable-checks', label: 'چک‌های دریافتی', icon: '💵' },
      { path: '/ongoing-debts', label: 'بدهی‌های در جریان', icon: '📊' },
    ] : []),
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="sidebar hidden md:block">
        <div className="py-4">
          <Link
            to="/dashboard"
            className="mr-6 text-lg font-bold text-gray-900 block mb-6"
          >
            پنل مدیریت
          </Link>
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                >
                  <span className="ml-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <aside
            className="sidebar fixed right-0 top-0 h-full z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-4">
              <Link
                to="/dashboard"
                className="mr-6 text-lg font-bold text-gray-900 block mb-6"
                onClick={() => setIsSidebarOpen(false)}
              >
                پنل مدیریت
              </Link>
              <ul>
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`sidebar-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span className="ml-3">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      )}

      <div className="flex flex-col w-full main-content">
        {/* Header */}
        <header className="bg-white shadow-md py-4 px-6">
          <div className="flex items-center justify-between">
            <button
              className="p-2 rounded-md md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="flex items-center">
              <span className="text-gray-700 font-medium">
                {user?.full_name || user?.username}
              </span>
              <span className="mr-2 text-gray-500">
                ({user?.role === 'management' ? 'مدیر' : 'حسابدار'})
              </span>
              <button
                onClick={handleLogout}
                className="mr-4 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                خروج
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
