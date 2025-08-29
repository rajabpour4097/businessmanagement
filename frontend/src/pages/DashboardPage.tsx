import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { financialService } from '../services/financial';
import { FinancialSummary } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await financialService.getFinancialSummary();
        setSummary(data);
      } catch (err) {
        console.error('Error fetching financial summary:', err);
        setError('خطا در بارگیری اطلاعات خلاصه مالی');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const formatNumber = (num: number | string) => {
    const numericValue = typeof num === 'string' ? parseFloat(num) : num;
    return new Intl.NumberFormat('fa-IR').format(numericValue);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">داشبورد</h1>
          <p className="text-gray-600 mt-2">
            خوش آمدید، {user?.full_name || user?.username} - {user?.role === 'management' ? 'مدیریت' : 'حسابداری'}
          </p>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">در حال بارگیری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">داشبورد</h1>
          <p className="text-gray-600 mt-2">
            خوش آمدید، {user?.full_name || user?.username} - {user?.role === 'management' ? 'مدیریت' : 'حسابداری'}
          </p>
        </div>
        <div className="error-container">
          <div className="text-4xl mb-4">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">داشبورد</h1>
        <p className="text-gray-600 mt-2">
          خوش آمدید، {user?.full_name || user?.username} - {user?.role === 'management' ? 'مدیریت' : 'حسابداری'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">
            💰
          </div>
          <div className="stat-content">
            <h3 className="stat-title">کل حساب‌ها</h3>
            <p className="stat-value">{formatNumber(summary?.total_accounts || 0)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-green-100">
            💳
          </div>
          <div className="stat-content">
            <h3 className="stat-title">موجودی کل</h3>
            <p className="stat-value">{formatNumber(summary?.total_balance || '0')} ریال</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-orange-100">
            ⚠️
          </div>
          <div className="stat-content">
            <h3 className="stat-title">حساب‌های معوقه</h3>
            <p className="stat-value">{formatNumber(summary?.overdue_accounts_count || 0)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-red-100">
            🔴
          </div>
          <div className="stat-content">
            <h3 className="stat-title">مبلغ معوقه</h3>
            <p className="stat-value">{formatNumber(summary?.overdue_amount || '0')} ریال</p>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">مغایرت‌ها</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">در انتظار بررسی</span>
            <span className="font-bold text-orange-600">
              {formatNumber(summary?.pending_discrepancies || 0)}
            </span>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">چک‌ها</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">پرداختی</span>
              <span className="font-bold text-red-600">
                {formatNumber(summary?.payable_checks_count || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">دریافتی</span>
              <span className="font-bold text-green-600">
                {formatNumber(summary?.receivable_checks_count || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">بدهی‌های در جریان</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">تعداد</span>
              <span className="font-bold text-purple-600">
                {formatNumber(summary?.ongoing_debts_count || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">مبلغ کل</span>
              <span className="font-bold text-purple-600">
                {formatNumber(summary?.ongoing_debts_amount || '0')} ریال
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
