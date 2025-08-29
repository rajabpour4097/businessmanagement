import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/AccountsPage';
import OverdueAccountsPage from './pages/OverdueAccountsPage';
import DiscrepanciesPage from './pages/DiscrepanciesPage';
import FollowUpsPage from './pages/FollowUpsPage';
import ChecksPage from './pages/ChecksPage';
import OngoingDebtsPage from './pages/OngoingDebtsPage';
import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600">در حال بارگیری...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Role-based Route Component
const RoleRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'management' | 'accounting';
}> = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (requiredRole === 'management' && user?.role !== 'management') {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole === 'accounting' && !['management', 'accounting'].includes(user?.role || '')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Placeholder components for other pages
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="space-y-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-2">این بخش در حال توسعه است.</p>
    </div>
    <div className="card p-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          در حال توسعه
        </h3>
        <p className="text-gray-600">
          این صفحه به زودی در دسترس خواهد بود.
        </p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              
              {/* Management Only Routes */}
              <Route
                path="users"
                element={
                  <RoleRoute requiredRole="management">
                    <PlaceholderPage title="مدیریت کاربران" />
                  </RoleRoute>
                }
              />
              
              {/* Accounting Accessible Routes */}
              <Route
                path="accounts"
                element={
                  <RoleRoute requiredRole="accounting">
                    <AccountsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="overdue-accounts"
                element={
                  <RoleRoute requiredRole="accounting">
                    <OverdueAccountsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="discrepancies"
                element={
                  <RoleRoute requiredRole="accounting">
                    <DiscrepanciesPage />
                  </RoleRoute>
                }
              />
              <Route
                path="follow-ups"
                element={
                  <RoleRoute requiredRole="accounting">
                    <FollowUpsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="inventory-stats"
                element={
                  <RoleRoute requiredRole="accounting">
                    <PlaceholderPage title="آمار انبار" />
                  </RoleRoute>
                }
              />
              <Route
                path="tasks"
                element={
                  <RoleRoute requiredRole="accounting">
                    <PlaceholderPage title="لیست کارها" />
                  </RoleRoute>
                }
              />
              <Route
                path="payable-checks"
                element={
                  <RoleRoute requiredRole="accounting">
                    <ChecksPage />
                  </RoleRoute>
                }
              />
              <Route
                path="receivable-checks"
                element={
                  <RoleRoute requiredRole="accounting">
                    <ChecksPage />
                  </RoleRoute>
                }
              />
              <Route
                path="checks"
                element={
                  <RoleRoute requiredRole="accounting">
                    <ChecksPage />
                  </RoleRoute>
                }
              />
              <Route
                path="ongoing-debts"
                element={
                  <RoleRoute requiredRole="accounting">
                    <OngoingDebtsPage />
                  </RoleRoute>
                }
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
