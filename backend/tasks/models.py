from django.db import models
from django.conf import settings


class Task(models.Model):
    """مدل کارها"""
    PRIORITY_CHOICES = [
        ('low', 'کم'),
        ('medium', 'متوسط'),
        ('high', 'بالا'),
        ('urgent', 'فوری'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'در انتظار'),
        ('in_progress', 'در حال انجام'),
        ('completed', 'تکمیل شده'),
        ('cancelled', 'لغو شده'),
    ]
    
    title = models.CharField(max_length=200, verbose_name='عنوان کار')
    description = models.TextField(verbose_name='توضیحات')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assigned_tasks', verbose_name='محول شده به')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_tasks', verbose_name='ایجاد شده توسط')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium', verbose_name='اولویت')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='وضعیت')
    due_date = models.DateTimeField(verbose_name='موعد انجام')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='تاریخ تکمیل')
    is_completed = models.BooleanField(default=False, verbose_name='تکمیل شده')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='تاریخ به‌روزرسانی')
    
    class Meta:
        verbose_name = 'کار'
        verbose_name_plural = 'کارها'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"

    def save(self, *args, **kwargs):
        # اگر وضعیت به تکمیل شده تغییر کرد، تاریخ تکمیل را ثبت کن
        if self.status == 'completed' and not self.completed_at:
            from django.utils import timezone
            self.completed_at = timezone.now()
            self.is_completed = True
        super().save(*args, **kwargs)


class TaskComment(models.Model):
    """مدل نظرات کار"""
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments', verbose_name='کار')
    comment = models.TextField(verbose_name='نظر')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='ایجاد شده توسط')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')
    
    class Meta:
        verbose_name = 'نظر کار'
        verbose_name_plural = 'نظرات کار'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"نظر برای {self.task.title}"


class TaskAttachment(models.Model):
    """مدل پیوست‌های کار"""
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='attachments', verbose_name='کار')
    file = models.FileField(upload_to='task_attachments/', verbose_name='فایل')
    description = models.CharField(max_length=200, blank=True, verbose_name='توضیحات')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='آپلود شده توسط')
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ آپلود')
    
    class Meta:
        verbose_name = 'پیوست کار'
        verbose_name_plural = 'پیوست‌های کار'
    
    def __str__(self):
        return f"پیوست برای {self.task.title}"
