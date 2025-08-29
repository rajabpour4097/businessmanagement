import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { financialService } from '../services/financial';
import { PayableCheck, ReceivableCheck } from '../types';

const ChecksPage: React.FC = () => {
  const { hasAccountingAccess } = useAuth();
  const [payableChecks, setPayableChecks] = useState<PayableCheck[]>([]);
  const [receivableChecks, setReceivableChecks] = useState<ReceivableCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'payable' | 'receivable'>('payable');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChecks();
  }, []);

  const fetchChecks = async () => {
    if (!hasAccountingAccess()) {
      setError('شما دسترسی لازم برای مشاهده این صفحه را ندارید');
      setIsLoading(false);
      return;
    }

    try {
      const [payableData, receivableData] = await Promise.all([
        financialService.getPayableChecks(),
        financialService.getReceivableChecks()
      ]);
      setPayableChecks(payableData);
      setReceivableChecks(receivableData);
    } catch (err) {
      console.error('Error fetching checks:', err);
      setError('خطا در بارگیری لیست چک‌ها');
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
      case 'issued':
      case 'received':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
      case 'deposited':
        return 'bg-green-100 text-green-800';
      case 'returned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string, type: 'payable' | 'receivable') => {
    if (type === 'payable') {
      switch (status) {
        case 'issued':
          return 'صادر شده';
        case 'paid':
          return 'پرداخت شده';
        case 'returned':
          return 'برگشتی';
        default:
          return 'نامشخص';
      }
    } else {
      switch (status) {
        case 'received':
          return 'دریافت شده';
        case 'deposited':
          return 'واریز شده';
        case 'returned':
          return 'برگشتی';
        default:
          return 'نامشخص';
      }
    }
  };

  const isOverdue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    return dueDate < today;
  };

  const filteredPayableChecks = payableChecks.filter(check =>
    check.check_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.bank_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReceivableChecks = receivableChecks.filter(check =>
    check.check_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.payer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.bank_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">چک‌ها</h1>
          <p className="text-gray-600 mt-2">مدیریت چک‌های پرداختی و دریافتی</p>
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
          <h1 className="text-2xl font-bold text-gray-900">چک‌ها</h1>
          <p className="text-gray-600 mt-2">مدیریت چک‌های پرداختی و دریافتی</p>
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
        <h1 className="text-2xl font-bold text-gray-900">چک‌ها</h1>
        <p className="text-gray-600 mt-2">مدیریت چک‌های پرداختی و دریافتی</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="stat-card">
          <div className="stat-icon bg-red-100">
            📄
          </div>
          <div className="stat-content">
            <h3 className="stat-title">چک‌های پرداختی</h3>
            <p className="stat-value">{formatNumber(payableChecks.length)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-green-100">
            📃
          </div>
          <div className="stat-content">
            <h3 className="stat-title">چک‌های دریافتی</h3>
            <p className="stat-value">{formatNumber(receivableChecks.length)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-orange-100">
            💰
          </div>
          <div className="stat-content">
            <h3 className="stat-title">مبلغ کل پرداختی</h3>
            <p className="stat-value">
              {formatNumber(
                payableChecks.reduce((sum, check) => sum + parseFloat(check.amount), 0)
              )} ریال
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-blue-100">
            💳
          </div>
          <div className="stat-content">
            <h3 className="stat-title">مبلغ کل دریافتی</h3>
            <p className="stat-value">
              {formatNumber(
                receivableChecks.reduce((sum, check) => sum + parseFloat(check.amount), 0)
              )} ریال
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('payable')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'payable'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              چک‌های پرداختی ({payableChecks.length})
            </button>
            <button
              onClick={() => setActiveTab('receivable')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'receivable'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              چک‌های دریافتی ({receivableChecks.length})
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="جستجو در شماره چک، نام یا بانک..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full"
              />
            </div>
            <button className="btn btn-primary">
              ثبت چک جدید
            </button>
          </div>
        </div>

        {/* Tables */}
        <div className="overflow-x-auto">
          {activeTab === 'payable' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    شماره چک
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    مبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    دریافت‌کننده
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    بانک
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    سررسید
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayableChecks.map((check) => {
                  const overdue = check.status === 'issued' && isOverdue(check.due_date);
                  return (
                    <tr key={check.id} className={`hover:bg-gray-50 ${overdue ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {check.check_number}
                          {overdue && <span className="text-red-500 ml-2">⏰</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatNumber(check.amount)} ریال
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{check.payee}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{check.bank_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {formatDate(check.due_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(check.status)}`}>
                          {getStatusText(check.status, 'payable')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            مشاهده
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            ویرایش
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    شماره چک
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    مبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    پرداخت‌کننده
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    بانک
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    سررسید
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReceivableChecks.map((check) => {
                  const overdue = check.status === 'received' && isOverdue(check.due_date);
                  return (
                    <tr key={check.id} className={`hover:bg-gray-50 ${overdue ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {check.check_number}
                          {overdue && <span className="text-red-500 ml-2">⏰</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatNumber(check.amount)} ریال
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{check.payer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{check.bank_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {formatDate(check.due_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(check.status)}`}>
                          {getStatusText(check.status, 'receivable')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            مشاهده
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            ویرایش
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {((activeTab === 'payable' && filteredPayableChecks.length === 0) ||
            (activeTab === 'receivable' && filteredReceivableChecks.length === 0)) && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <div className="text-4xl mb-4">📄</div>
                <p className="text-lg">چکی یافت نشد</p>
                <p className="text-sm mt-2">
                  {searchTerm 
                    ? 'لطفاً عبارت جستجو را تغییر دهید' 
                    : `هنوز چک ${activeTab === 'payable' ? 'پرداختی' : 'دریافتی'}‌ای ثبت نشده است`
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChecksPage;
