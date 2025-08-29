from rest_framework import serializers
from .models import *


class AccountSerializer(serializers.ModelSerializer):
    """سریالایزر حساب‌ها"""
    
    class Meta:
        model = Account
        fields = '__all__'


class OverdueAccountSerializer(serializers.ModelSerializer):
    """سریالایزر حساب‌های معوقه"""
    account_name = serializers.CharField(source='account.name', read_only=True)
    
    class Meta:
        model = OverdueAccount
        fields = '__all__'


class DiscrepancySerializer(serializers.ModelSerializer):
    """سریالایزر مغایرت‌ها"""
    account_name = serializers.CharField(source='account.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    
    class Meta:
        model = Discrepancy
        fields = '__all__'
        read_only_fields = ['created_by']


class FollowUpSerializer(serializers.ModelSerializer):
    """سریالایزر پیگیری‌ها"""
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    
    class Meta:
        model = FollowUp
        fields = '__all__'
        read_only_fields = ['created_by']


class PayableCheckSerializer(serializers.ModelSerializer):
    """سریالایزر چک‌های پرداختی"""
    
    class Meta:
        model = PayableCheck
        fields = '__all__'


class ReceivableCheckSerializer(serializers.ModelSerializer):
    """سریالایزر چک‌های دریافتی"""
    
    class Meta:
        model = ReceivableCheck
        fields = '__all__'


class OngoingDebtSerializer(serializers.ModelSerializer):
    """سریالایزر بدهی‌های در جریان"""
    
    class Meta:
        model = OngoingDebt
        fields = '__all__'


class FinancialSummarySerializer(serializers.Serializer):
    """سریالایزر خلاصه مالی"""
    total_accounts = serializers.IntegerField()
    total_balance = serializers.DecimalField(max_digits=15, decimal_places=2)
    overdue_accounts_count = serializers.IntegerField()
    overdue_amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    pending_discrepancies = serializers.IntegerField()
    payable_checks_count = serializers.IntegerField()
    receivable_checks_count = serializers.IntegerField()
    ongoing_debts_count = serializers.IntegerField()
    ongoing_debts_amount = serializers.DecimalField(max_digits=15, decimal_places=2)
