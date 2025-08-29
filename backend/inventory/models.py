from django.db import models
from django.conf import settings


class Product(models.Model):
    """مدل محصولات"""
    name = models.CharField(max_length=200, verbose_name='نام محصول')
    code = models.CharField(max_length=50, unique=True, verbose_name='کد محصول')
    description = models.TextField(blank=True, verbose_name='توضیحات')
    unit_price = models.DecimalField(max_digits=15, decimal_places=2, verbose_name='قیمت واحد')
    quantity = models.IntegerField(default=0, verbose_name='موجودی')
    minimum_stock = models.IntegerField(default=0, verbose_name='حداقل موجودی')
    category = models.CharField(max_length=100, blank=True, verbose_name='دسته‌بندی')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    
    class Meta:
        verbose_name = 'محصول'
        verbose_name_plural = 'محصولات'
    
    def __str__(self):
        return f"{self.name} - {self.code}"

    @property
    def total_value(self):
        """محاسبه ارزش کل موجودی"""
        return self.quantity * self.unit_price

    @property
    def is_low_stock(self):
        """بررسی کمبود موجودی"""
        return self.quantity <= self.minimum_stock


class InventoryTransaction(models.Model):
    """مدل تراکنش‌های انبار"""
    TRANSACTION_TYPES = [
        ('in', 'ورود'),
        ('out', 'خروج'),
        ('adjustment', 'تعدیل'),
    ]
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name='محصول')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES, verbose_name='نوع تراکنش')
    quantity = models.IntegerField(verbose_name='تعداد')
    unit_price = models.DecimalField(max_digits=15, decimal_places=2, verbose_name='قیمت واحد')
    description = models.TextField(blank=True, verbose_name='توضیحات')
    reference_number = models.CharField(max_length=50, blank=True, verbose_name='شماره مرجع')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='ایجاد شده توسط')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    
    class Meta:
        verbose_name = 'تراکنش انبار'
        verbose_name_plural = 'تراکنش‌های انبار'
    
    def __str__(self):
        return f"{self.product.name} - {self.get_transaction_type_display()} - {self.quantity}"

    @property
    def total_amount(self):
        """محاسبه مبلغ کل تراکنش"""
        return self.quantity * self.unit_price


class InventoryStats(models.Model):
    """مدل آمار انبار"""
    date = models.DateField(verbose_name='تاریخ')
    total_products = models.IntegerField(default=0, verbose_name='تعداد کل محصولات')
    total_value = models.DecimalField(max_digits=20, decimal_places=2, default=0, verbose_name='ارزش کل انبار')
    low_stock_products = models.IntegerField(default=0, verbose_name='محصولات کم موجودی')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'آمار انبار'
        verbose_name_plural = 'آمار انبار'
        unique_together = ['date']
    
    def __str__(self):
        return f"آمار انبار - {self.date}"
