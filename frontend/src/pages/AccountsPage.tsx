import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { financialService } from '../services/financial';
import { Account } from '../types';

const AccountsPage: React.FC = () => {
  const { hasAccountingAccess } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    if (!hasAccountingAccess()) {
      setError('شما دسترسی لازم برای مشاهده این صفحه را ندارید');
      setIsLoading(false);
      return;
    }

    try {
      const data = await financialService.getAccounts();
      setAccounts(data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError('خطا در بارگیری لیست حساب‌ها');
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

  const getStatusColor = (isActive: boolean, balance: string) => {
    if (!isActive) return 'text-gray-500';
    const numBalance = parseFloat(balance);
    if (numBalance < 0) return 'text-red-600';
    return 'text-green-600';
  };

  const getStatusText = (isActive: boolean, balance: string) => {
    if (!isActive) return 'غیرفعال';
    const numBalance = parseFloat(balance);
    if (numBalance < 0) return 'بدهکار';
    return 'فعال';
  };

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.account_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">حساب‌ها</h1>
          <p className="text-gray-600 mt-2">مدیریت حساب‌های مشتریان</p>
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
          <h1 className="text-2xl font-bold text-gray-900">حساب‌ها</h1>
          <p className="text-gray-600 mt-2">مدیریت حساب‌های مشتریان</p>
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

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">حساب‌ها</h1>
        <p className="text-gray-600 mt-2">مدیریت حساب‌های مشتریان</p>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">
            📊
          </div>
          <div className="stat-content">
            <h3 className="stat-title">کل حساب‌ها</h3>
            <p className="stat-value">{formatNumber(accounts.length)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-green-100">
            ✅
          </div>
          <div className="stat-content">
            <h3 className="stat-title">حساب‌های فعال</h3>
            <p className="stat-value">
              {formatNumber(accounts.filter(acc => acc.is_active).length)}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-orange-100">
            💰
          </div>
          <div className="stat-content">
            <h3 className="stat-title">کل موجودی</h3>
            <p className="stat-value">
              {formatNumber(
                accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0)
              )} ریال
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-red-100">
            ⚠️
          </div>
          <div className="stat-content">
            <h3 className="stat-title">حساب‌های بدهکار</h3>
            <p className="stat-value">
              {formatNumber(accounts.filter(acc => parseFloat(acc.balance) < 0).length)}
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
              placeholder="جستجو در نام یا شماره حساب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full"
            />
          </div>
          <button className="btn btn-primary">
            افزودن حساب جدید
          </button>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نام حساب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  شماره حساب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  موجودی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ ایجاد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {account.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {account.account_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      parseFloat(account.balance) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatNumber(account.balance)} ریال
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      account.is_active 
                        ? parseFloat(account.balance) >= 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusText(account.is_active, account.balance)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(account.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        مشاهده
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        ویرایش
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-lg">حساب‌ای یافت نشد</p>
              <p className="text-sm mt-2">
                {searchTerm ? 'لطفاً عبارت جستجو را تغییر دهید' : 'هنوز حساب‌ای ایجاد نشده است'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsPage;
