import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { financialService } from '../services/financial';
import { OngoingDebt } from '../types';

const OngoingDebtsPage: React.FC = () => {
  const { hasAccountingAccess } = useAuth();
  const [ongoingDebts, setOngoingDebts] = useState<OngoingDebt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'partial_paid' | 'paid'>('all');

  useEffect(() => {
    fetchOngoingDebts();
  }, []);

  const fetchOngoingDebts = async () => {
    if (!hasAccountingAccess()) {
      setError('شما دسترسی لازم برای مشاهده این صفحه را ندارید');
      setIsLoading(false);
      return;
    }

    try {
      const data = await financialService.getOngoingDebts();
      setOngoingDebts(data);
    } catch (err) {
      console.error('Error fetching ongoing debts:', err);
      setError('خطا در بارگیری لیست بدهی‌های در جریان');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-800';
      case 'partial_paid':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'در انتظار پرداخت';
      case 'partial_paid':
        return 'پرداخت جزئی';
      case 'paid':
        return 'پرداخت شده';
      default:
        return 'نامشخص';
    }
  };

  const isOverdue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    return dueDate < today;
  };

  const filteredDebts = ongoingDebts.filter(debt => {
    const matchesSearch = 
      debt.creditor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debt.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || debt.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">بدهی‌های در جریان</h1>
          <p className="text-gray-600 mt-2">مدیریت بدهی‌های در جریان</p>
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
          <h1 className="text-2xl font-bold text-gray-900">بدهی‌های در جریان</h1>
          <p className="text-gray-600 mt-2">مدیریت بدهی‌های در جریان</p>
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

  const totalDebtAmount = ongoingDebts
    .filter(debt => debt.status !== 'paid')
    .reduce((sum, debt) => sum + parseFloat(debt.amount), 0);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">بدهی‌های در جریان</h1>
        <p className="text-gray-600 mt-2">مدیریت بدهی‌های در جریان</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">
            💰
          </div>
          <div className="stat-content">
            <h3 className="stat-title">کل بدهی‌ها</h3>
            <p className="stat-value">{formatNumber(ongoingDebts.length)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-red-100">
            ⏳
          </div>
          <div className="stat-content">
            <h3 className="stat-title">در انتظار پرداخت</h3>
            <p className="stat-value">
              {formatNumber(ongoingDebts.filter(d => d.status === 'pending').length)}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-orange-100">
            💸
          </div>
          <div className="stat-content">
            <h3 className="stat-title">مبلغ کل باقیمانده</h3>
            <p className="stat-value">{formatNumber(totalDebtAmount)} ریال</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-red-100">
            ⏰
          </div>
          <div className="stat-content">
            <h3 className="stat-title">عقب‌افتاده</h3>
            <p className="stat-value">
              {formatNumber(
                ongoingDebts.filter(d => d.status !== 'paid' && isOverdue(d.due_date)).length
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="جستجو در نام طلبکار یا توضیحات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="input"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="pending">در انتظار پرداخت</option>
            <option value="partial_paid">پرداخت جزئی</option>
            <option value="paid">پرداخت شده</option>
          </select>
          <button className="btn btn-primary">
            ثبت بدهی جدید
          </button>
        </div>
      </div>

      {/* Debts Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  طلبکار
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  توضیحات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  سررسید
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
              {filteredDebts.map((debt) => {
                const overdue = debt.status !== 'paid' && isOverdue(debt.due_date);
                return (
                  <tr key={debt.id} className={`hover:bg-gray-50 ${overdue ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {debt.creditor_name}
                        {overdue && <span className="text-red-500 ml-2">⏰</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-red-600">
                        {formatNumber(debt.amount)} ریال
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {debt.description.length > 50 
                          ? `${debt.description.substring(0, 50)}...`
                          : debt.description
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {formatDate(debt.due_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(debt.status)}`}>
                        {getStatusText(debt.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(debt.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          مشاهده
                        </button>
                        {debt.status !== 'paid' && (
                          <button className="text-green-600 hover:text-green-900">
                            پرداخت
                          </button>
                        )}
                        <button className="text-purple-600 hover:text-purple-900">
                          ویرایش
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredDebts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">💰</div>
              <p className="text-lg">بدهی‌ای یافت نشد</p>
              <p className="text-sm mt-2">
                {searchTerm || filterStatus !== 'all' 
                  ? 'لطفاً فیلترها را تغییر دهید' 
                  : 'هنوز بدهی‌ای ثبت نشده است'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OngoingDebtsPage;
