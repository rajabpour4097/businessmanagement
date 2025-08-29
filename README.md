# داشبورد مدیریت کسب و کار

یک سیستم مدیریت کامل با Django REST API و React frontend که دو سطح دسترسی **مدیریت** و **حسابداری** دارد.

## ویژگی‌ها

### سطح دسترسی مدیریت
- دسترسی به تمام بخش‌ها
- مدیریت کاربران
- مشاهده تمام گزارش‌ها

### سطح دسترسی حسابداری
- مانده حساب‌ها
- مانده حساب‌های معوقه
- مغایرت‌ها
- پیگیری‌ها
- آمار انبار
- لیست کارها
- مانده چک‌های پرداختی
- مانده چک‌های دریافتی
- بدهی‌های در جریان

## نصب و راه‌اندازی

### پیش‌نیازها
- Python 3.8+
- Node.js 16+
- npm یا yarn

### Backend (Django)

1. ایجاد virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# یا
venv\Scripts\activate  # Windows
```

2. نصب dependencies:
```bash
pip install django djangorestframework django-cors-headers django-filter djangorestframework-simplejwt python-decouple Pillow
```

3. اجرای migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. ایجاد superuser:
```bash
python manage.py createsuperuser
```

5. راه‌اندازی server:
```bash
python manage.py runserver
```

### Frontend (React)

1. نصب dependencies:
```bash
cd frontend
npm install
```

2. راه‌اندازی development server:
```bash
npm run dev
```

## حساب‌های آزمایشی

- **مدیر:** username: `admin`, password: `admin123`
- **حسابدار:** username: `accounting`, password: `acc123`

## API Endpoints

### Authentication
- `POST /api/auth/login/` - ورود کاربر
- `POST /api/auth/logout/` - خروج کاربر
- `GET /api/auth/profile/` - پروفایل کاربر
- `POST /api/auth/change-password/` - تغییر رمز عبور

### Financial
- `GET /api/financial/accounts/` - لیست حساب‌ها
- `GET /api/financial/overdue-accounts/` - حساب‌های معوقه
- `GET /api/financial/discrepancies/` - مغایرت‌ها
- `GET /api/financial/follow-ups/` - پیگیری‌ها
- `GET /api/financial/payable-checks/` - چک‌های پرداختی
- `GET /api/financial/receivable-checks/` - چک‌های دریافتی
- `GET /api/financial/ongoing-debts/` - بدهی‌های در جریان
- `GET /api/financial/summary/` - خلاصه مالی

## ساختار پروژه

```
ShoppingManagement/
├── backend/                    # Django REST API
│   ├── authentication/        # مدیریت کاربران
│   ├── financial/             # مدیریت امور مالی
│   ├── inventory/             # مدیریت انبار
│   ├── tasks/                 # مدیریت کارها
│   └── dashboard_management/  # تنظیمات اصلی
├── frontend/                  # React Application
│   ├── src/
│   │   ├── components/        # کامپوننت‌های قابل استفاده مجدد
│   │   ├── pages/            # صفحات اصلی
│   │   ├── services/         # سرویس‌های API
│   │   ├── context/          # Context های React
│   │   └── types/            # Type definitions
│   └── public/               # فایل‌های استاتیک
└── README.md
```

## تکنولوژی‌های استفاده شده

### Backend
- Django 5.2
- Django REST Framework
- JWT Authentication
- CORS Headers
- SQLite (قابل تغییر به PostgreSQL/MySQL)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

## توسعه

برای توسعه بیشتر می‌توانید:

1. مدل‌های جدید به app های موجود اضافه کنید
2. API endpoint های جدید ایجاد کنید
3. صفحات جدید در React اضافه کنید
4. سطوح دسترسی جدید تعریف کنید

## مجوز

این پروژه تحت مجوز MIT منتشر شده است.
# businessmanagement
