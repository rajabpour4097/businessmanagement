from django.db import models
from django.conf import settings


class Account(models.Model):
    """مدل حساب‌ها"""
    name = models.CharField(max_length=200, verbose_name='نام حساب')
    account_number = models.CharField(max_length=50, unique=True, verbose_name='شماره حساب')
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0, verbose_name='مانده')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    
    class Meta:
        verbose_name = 'حساب'
        verbose_name_plural = 'حساب‌ها'
    
    def __str__(self):
        return f"{self.name} - {self.account_number}"


class OverdueAccount(models.Model):
    """مدل حساب‌های معوقه"""
    account = models.ForeignKey(Account, on_delete=models.CASCADE, verbose_name='حساب')
    customer_name = models.CharField(max_length=200, verbose_name='نام مشتری')
    overdue_amount = models.DecimalField(max_digits=15, decimal_places=2, verbose_name='مبلغ معوقه')
    due_date = models.DateField(verbose_name='تاریخ سررسید')
    contact_info = models.TextField(blank=True, verbose_name='اطلاعات تماس')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'حساب معوقه'
        verbose_name_plural = 'حساب‌های معوقه'
    
    def __str__(self):
        return f"{self.customer_name} - {self.overdue_amount}"


class Discrepancy(models.Model):
    """مدل مغایرت‌ها"""
    title = models.CharField(max_length=200, verbose_name='عنوان مغایرت')
    description = models.TextField(verbose_name='توضیحات')
    amount = models.DecimalField(max_digits=15, decimal_places=2, verbose_name='مبلغ')
    account = models.ForeignKey(Account, on_delete=models.CASCADE, verbose_name='حساب')
    status = models.CharField(max_length=50, choices=[
        ('pending', 'در انتظار بررسی'),
        ('resolved', 'حل شده'),
        ('rejected', 'رد شده')
    ], default='pending', verbose_name='وضعیت')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='ایجاد شده توسط')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    
    class Meta:
        verbose_name = 'مغایرت'
        verbose_name_plural = 'مغایرت‌ها'
    
    def __str__(self):
        return self.title


class FollowUp(models.Model):
    """مدل پیگیری‌ها"""
    title = models.CharField(max_length=200, verbose_name='عنوان پیگیری')
    description = models.TextField(verbose_name='توضیحات')
    customer_name = models.CharField(max_length=200, verbose_name='نام مشتری')
    follow_up_date = models.DateField(verbose_name='تاریخ پیگیری')
    status = models.CharField(max_length=50, choices=[
        ('pending', 'در انتظار'),
        ('in_progress', 'در حال انجام'),
        ('completed', 'تکمیل شده')
    ], default='pending', verbose_name='وضعیت')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='ایجاد شده توسط')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'پیگیری'
        verbose_name_plural = 'پیگیری‌ها'
    
    def __str__(self):
        return self.title


class PayableCheck(models.Model):
    """مدل چک‌های پرداختی"""
    check_number = models.CharField(max_length=50, verbose_name='شماره چک')
    amount = models.DecimalField(max_digits=15, decimal_places=2, verbose_name='مبلغ')
    payee = models.CharField(max_length=200, verbose_name='گیرنده')
    due_date = models.DateField(verbose_name='تاریخ سررسید')
    bank_name = models.CharField(max_length=100, verbose_name='نام بانک')
    status = models.CharField(max_length=50, choices=[
        ('issued', 'صادر شده'),
        ('paid', 'پرداخت شده'),
        ('returned', 'برگشت خورده')
    ], default='issued', verbose_name='وضعیت')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'چک پرداختی'
        verbose_name_plural = 'چک‌های پرداختی'
    
    def __str__(self):
        return f"{self.check_number} - {self.payee}"


class ReceivableCheck(models.Model):
    """مدل چک‌های دریافتی"""
    check_number = models.CharField(max_length=50, verbose_name='شماره چک')
    amount = models.DecimalField(max_digits=15, decimal_places=2, verbose_name='مبلغ')
    payer = models.CharField(max_length=200, verbose_name='پرداخت کننده')
    due_date = models.DateField(verbose_name='تاریخ سررسید')
    bank_name = models.CharField(max_length=100, verbose_name='نام بانک')
    status = models.CharField(max_length=50, choices=[
        ('received', 'دریافت شده'),
        ('deposited', 'واریز شده'),
        ('returned', 'برگشت خورده')
    ], default='received', verbose_name='وضعیت')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'چک دریافتی'
        verbose_name_plural = 'چک‌های دریافتی'
    
    def __str__(self):
        return f"{self.check_number} - {self.payer}"


class OngoingDebt(models.Model):
    """مدل بدهی‌های در جریان"""
    creditor_name = models.CharField(max_length=200, verbose_name='نام طلبکار')
    amount = models.DecimalField(max_digits=15, decimal_places=2, verbose_name='مبلغ')
    description = models.TextField(verbose_name='توضیحات')
    due_date = models.DateField(verbose_name='تاریخ سررسید')
    status = models.CharField(max_length=50, choices=[
        ('pending', 'در انتظار'),
        ('partial_paid', 'پرداخت جزئی'),
        ('paid', 'پرداخت شده')
    ], default='pending', verbose_name='وضعیت')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'بدهی در جریان'
        verbose_name_plural = 'بدهی‌های در جریان'
    
    def __str__(self):
        return f"{self.creditor_name} - {self.amount}"
