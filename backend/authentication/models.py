from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """مدل کاربر سفارشی با سطوح دسترسی مختلف"""
    
    USER_ROLE_CHOICES = [
        ('management', 'مدیریت'),
        ('accounting', 'حسابداری'),
    ]
    
    role = models.CharField(max_length=20, choices=USER_ROLE_CHOICES, default='accounting', verbose_name='نقش کاربر')
    full_name = models.CharField(max_length=100, blank=True, verbose_name='نام کامل')
    phone_number = models.CharField(max_length=15, blank=True, verbose_name='شماره تلفن')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ به‌روزرسانی')

    class Meta:
        verbose_name = 'کاربر'
        verbose_name_plural = 'کاربران'

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"

    @property
    def has_management_access(self):
        """بررسی دسترسی مدیریت"""
        return self.role == 'management'

    @property
    def has_accounting_access(self):
        """بررسی دسترسی حسابداری"""
        return self.role in ['management', 'accounting']
