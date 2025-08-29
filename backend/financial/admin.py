from django.contrib import admin
from .models import *


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('name', 'account_number', 'balance', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'account_number')


@admin.register(OverdueAccount)
class OverdueAccountAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'account', 'overdue_amount', 'due_date', 'created_at')
    list_filter = ('due_date', 'created_at')
    search_fields = ('customer_name', 'account__name')


@admin.register(Discrepancy)
class DiscrepancyAdmin(admin.ModelAdmin):
    list_display = ('title', 'account', 'amount', 'status', 'created_by', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'account__name')


@admin.register(FollowUp)
class FollowUpAdmin(admin.ModelAdmin):
    list_display = ('title', 'customer_name', 'follow_up_date', 'status', 'created_by')
    list_filter = ('status', 'follow_up_date', 'created_at')
    search_fields = ('title', 'customer_name')


@admin.register(PayableCheck)
class PayableCheckAdmin(admin.ModelAdmin):
    list_display = ('check_number', 'payee', 'amount', 'due_date', 'status', 'bank_name')
    list_filter = ('status', 'due_date', 'bank_name')
    search_fields = ('check_number', 'payee')


@admin.register(ReceivableCheck)
class ReceivableCheckAdmin(admin.ModelAdmin):
    list_display = ('check_number', 'payer', 'amount', 'due_date', 'status', 'bank_name')
    list_filter = ('status', 'due_date', 'bank_name')
    search_fields = ('check_number', 'payer')


@admin.register(OngoingDebt)
class OngoingDebtAdmin(admin.ModelAdmin):
    list_display = ('creditor_name', 'amount', 'due_date', 'status', 'created_at')
    list_filter = ('status', 'due_date', 'created_at')
    search_fields = ('creditor_name',)
