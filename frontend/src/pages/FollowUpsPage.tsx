import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { financialService } from '../services/financial';
import { FollowUp } from '../types';

const FollowUpsPage: React.FC = () => {
  const { hasAccountingAccess } = useAuth();
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    if (!hasAccountingAccess()) {
      setError('شما دسترسی لازم برای مشاهده این صفحه را ندارید');
      setIsLoading(false);
      return;
    }

    try {
      const data = await financialService.getFollowUps();
      setFollowUps(data);
    } catch (err) {
      console.error('Error fetching follow-ups:', err);
      setError('خطا در بارگیری لیست پیگیری‌ها');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'در انتظار';
      case 'in_progress':
        return 'در حال انجام';
      case 'completed':
        return 'تکمیل شده';
      default:
        return 'نامشخص';
    }
  };

  const isOverdue = (followUpDate: string) => {
    const today = new Date();
    const targetDate = new Date(followUpDate);
    return targetDate < today;
  };

  const filteredFollowUps = followUps.filter(followUp => {
    const matchesSearch = 
      followUp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.created_by_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || followUp.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">پیگیری‌ها</h1>
          <p className="text-gray-600 mt-2">مدیریت پیگیری‌های مشتریان</p>
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
          <h1 className="text-2xl font-bold text-gray-900">پیگیری‌ها</h1>
          <p className="text-gray-600 mt-2">مدیریت پیگیری‌های مشتریان</p>
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
        <h1 className="text-2xl font-bold text-gray-900">پیگیری‌ها</h1>
        <p className="text-gray-600 mt-2">مدیریت پیگیری‌های مشتریان</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="stat-card">
          <div className="stat-icon bg-blue-100">
            📋
          </div>
          <div className="stat-content">
            <h3 className="stat-title">کل پیگیری‌ها</h3>
            <p className="stat-value">{followUps.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-yellow-100">
            ⏳
          </div>
          <div className="stat-content">
            <h3 className="stat-title">در انتظار</h3>
            <p className="stat-value">
              {followUps.filter(f => f.status === 'pending').length}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-blue-100">
            🔄
          </div>
          <div className="stat-content">
            <h3 className="stat-title">در حال انجام</h3>
            <p className="stat-value">
              {followUps.filter(f => f.status === 'in_progress').length}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-red-100">
            ⏰
          </div>
          <div className="stat-content">
            <h3 className="stat-title">عقب‌افتاده</h3>
            <p className="stat-value">
              {followUps.filter(f => f.status !== 'completed' && isOverdue(f.follow_up_date)).length}
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
              placeholder="جستجو در عنوان، توضیحات یا نام مشتری..."
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
            <option value="pending">در انتظار</option>
            <option value="in_progress">در حال انجام</option>
            <option value="completed">تکمیل شده</option>
          </select>
          <button className="btn btn-primary">
            ثبت پیگیری جدید
          </button>
        </div>
      </div>

      {/* Follow-ups Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عنوان
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مشتری
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ پیگیری
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
              {filteredFollowUps.map((followUp) => {
                const overdue = followUp.status !== 'completed' && isOverdue(followUp.follow_up_date);
                return (
                  <tr key={followUp.id} className={`hover:bg-gray-50 ${overdue ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {followUp.title}
                        {overdue && <span className="text-red-500 ml-2">⏰</span>}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {followUp.description.length > 50 
                          ? `${followUp.description.substring(0, 50)}...`
                          : followUp.description
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {followUp.customer_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {formatDate(followUp.follow_up_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(followUp.status)}`}>
                        {getStatusText(followUp.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {followUp.created_by_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(followUp.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          مشاهده
                        </button>
                        {followUp.status !== 'completed' && (
                          <button className="text-green-600 hover:text-green-900">
                            به‌روزرسانی
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

        {filteredFollowUps.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-lg">پیگیری‌ای یافت نشد</p>
              <p className="text-sm mt-2">
                {searchTerm || filterStatus !== 'all' 
                  ? 'لطفاً فیلترها را تغییر دهید' 
                  : 'هنوز پیگیری‌ای ثبت نشده است'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpsPage;
