import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { financialService } from '../services/financial';
import { Discrepancy } from '../types';

const DiscrepanciesPage: React.FC = () => {
  const { hasAccountingAccess } = useAuth();
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved' | 'rejected'>('all');

  useEffect(() => {
    fetchDiscrepancies();
  }, []);

  const fetchDiscrepancies = async () => {
    if (!hasAccountingAccess()) {
      setError('شما دسترسی لازم برای مشاهده این صفحه را ندارید');
      setIsLoading(false);
      return;
    }

    try {
      const data = await financialService.getDiscrepancies();
      setDiscrepancies(data);
    } catch (err) {
      console.error('Error fetching discrepancies:', err);
      setError('خطا در بارگیری لیست مغایرت‌ها');
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
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'در انتظار بررسی';
      case 'resolved':
        return 'حل شده';
      case 'rejected':
        return 'رد شده';
      default:
        return 'نامشخص';
    }
  };

  const filteredDiscrepancies = discrepancies.filter(discrepancy => {
    const matchesSearch = 
      discrepancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discrepancy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discrepancy.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discrepancy.created_by_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || discrepancy.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">مغایرت‌ها</h1>
          <p className="text-gray-600 mt-2">مدیریت مغایرت‌های مالی</p>
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
          <h1 className="text-2xl font-bold text-gray-900">مغایرت‌ها</h1>
          <p className="text-gray-600 mt-2">مدیریت مغایرت‌های مالی</p>
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
        <h1 className="text-2xl font-bold text-gray-900">مغایرت‌ها</h1>
        <p className="text-gray-600 mt-2">مدیریت مغایرت‌های مالی</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">
            📊
          </div>
          <div className="stat-content">
            <h3 className="stat-title">کل مغایرت‌ها</h3>
            <p className="stat-value">{formatNumber(discrepancies.length)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-yellow-100">
            ⏳
          </div>
          <div className="stat-content">
            <h3 className="stat-title">در انتظار بررسی</h3>
            <p className="stat-value">
              {formatNumber(discrepancies.filter(d => d.status === 'pending').length)}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-green-100">
            ✅
          </div>
          <div className="stat-content">
            <h3 className="stat-title">حل شده</h3>
            <p className="stat-value">
              {formatNumber(discrepancies.filter(d => d.status === 'resolved').length)}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-red-100">
            ❌
          </div>
          <div className="stat-content">
            <h3 className="stat-title">رد شده</h3>
            <p className="stat-value">
              {formatNumber(discrepancies.filter(d => d.status === 'rejected').length)}
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
              placeholder="جستجو در عنوان، توضیحات یا نام حساب..."
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
            <option value="pending">در انتظار بررسی</option>
            <option value="resolved">حل شده</option>
            <option value="rejected">رد شده</option>
          </select>
          <button className="btn btn-primary">
            ثبت مغایرت جدید
          </button>
        </div>
      </div>

      {/* Discrepancies Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عنوان
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  حساب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ایجاد شده توسط
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
              {filteredDiscrepancies.map((discrepancy) => (
                <tr key={discrepancy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {discrepancy.title}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {discrepancy.description.length > 50 
                        ? `${discrepancy.description.substring(0, 50)}...`
                        : discrepancy.description
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {discrepancy.account_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatNumber(discrepancy.amount)} ریال
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(discrepancy.status)}`}>
                      {getStatusText(discrepancy.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discrepancy.created_by_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(discrepancy.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        مشاهده
                      </button>
                      {discrepancy.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900">
                            تایید
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            رد
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDiscrepancies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-lg">مغایرتی یافت نشد</p>
              <p className="text-sm mt-2">
                {searchTerm || filterStatus !== 'all' 
                  ? 'لطفاً فیلترها را تغییر دهید' 
                  : 'هنوز مغایرتی ثبت نشده است'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscrepanciesPage;
