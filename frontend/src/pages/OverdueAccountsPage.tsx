import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { financialService } from '../services/financial';
import { OverdueAccount } from '../types';

const OverdueAccountsPage: React.FC = () => {
  const { hasAccountingAccess } = useAuth();
  const [overdueAccounts, setOverdueAccounts] = useState<OverdueAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOverdueAccounts();
  }, []);

  const fetchOverdueAccounts = async () => {
    if (!hasAccountingAccess()) {
      setError('شما دسترسی لازم برای مشاهده این صفحه را ندارید');
      setIsLoading(false);
      return;
    }

    try {
      const data = await financialService.getOverdueAccounts();
      setOverdueAccounts(data);
    } catch (err) {
      console.error('Error fetching overdue accounts:', err);
      setError('خطا در بارگیری لیست حساب‌های معوقه');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: string | number) => {
    const numericValue = typeof num === 'string' ? parseFloat(num) : num;
    return new Intl.NumberFormat('fa-IR').format(numericValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const calculateDaysOverdue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getUrgencyColor = (daysOverdue: number) => {
    if (daysOverdue > 60) return 'text-red-600 bg-red-100';
    if (daysOverdue > 30) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const filteredAccounts = overdueAccounts.filter(account =>
    account.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.contact_info.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">حساب‌های معوقه</h1>
          <p className="text-gray-600 mt-2">مدیریت حساب‌های معوقه مشتریان</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">در حال بارگیری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">حساب‌های معوقه</h1>
          <p className="text-gray-600 mt-2">مدیریت حساب‌های معوقه مشتریان</p>
        </div>
        <div className="card p-6">
          <div className="text-center text-red-600">
            <div className="text-4xl mb-4">⚠️</div>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const totalOverdueAmount = overdueAccounts.reduce(
    (sum, account) => sum + parseFloat(account.overdue_amount), 
    0
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">حساب‌های معوقه</h1>
        <p className="text-gray-600 mt-2">مدیریت حساب‌های معوقه مشتریان</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="stat-card">
          <div className="stat-icon bg-red-100">
            ⚠️
          </div>
          <div className="stat-content">
            <h3 className="stat-title">کل حساب‌های معوقه</h3>
            <p className="stat-value">{formatNumber(overdueAccounts.length)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-orange-100">
            💰
          </div>
          <div className="stat-content">
            <h3 className="stat-title">کل مبلغ معوقه</h3>
            <p className="stat-value">{formatNumber(totalOverdueAmount)} ریال</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-yellow-100">
            📅
          </div>
          <div className="stat-content">
            <h3 className="stat-title">معوقه زیر ۳۰ روز</h3>
            <p className="stat-value">
              {formatNumber(
                overdueAccounts.filter(acc => 
                  calculateDaysOverdue(acc.due_date) <= 30
                ).length
              )}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-red-100">
            🚨
          </div>
          <div className="stat-content">
            <h3 className="stat-title">معوقه بالای ۶۰ روز</h3>
            <p className="stat-value">
              {formatNumber(
                overdueAccounts.filter(acc => 
                  calculateDaysOverdue(acc.due_date) > 60
                ).length
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="جستجو در نام مشتری، حساب یا اطلاعات تماس..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full"
            />
          </div>
          <button className="btn btn-primary">
            گزارش‌گیری
          </button>
        </div>
      </div>

      {/* Overdue Accounts Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نام مشتری
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  حساب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مبلغ معوقه
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ سررسید
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  روزهای معوقه
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اطلاعات تماس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account) => {
                const daysOverdue = calculateDaysOverdue(account.due_date);
                return (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {account.customer_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {account.account_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-red-600">
                        {formatNumber(account.overdue_amount)} ریال
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(account.due_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(daysOverdue)}`}>
                        {formatNumber(daysOverdue)} روز
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.contact_info}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          تماس
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          پیگیری
                        </button>
                        <button className="text-purple-600 hover:text-purple-900">
                          پرداخت
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">✅</div>
              <p className="text-lg">حساب معوقه‌ای یافت نشد</p>
              <p className="text-sm mt-2">
                {searchTerm ? 'لطفاً عبارت جستجو را تغییر دهید' : 'همه حساب‌ها به‌روز هستند!'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverdueAccountsPage;
