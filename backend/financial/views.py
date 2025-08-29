from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum, Count
from .models import *
from .serializers import *


class IsAccountingOrManagement(permissions.BasePermission):
    """مجوز دسترسی برای حسابداری یا مدیریت"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.has_accounting_access


# Account Views
class AccountListCreateView(generics.ListCreateAPIView):
    """ویو لیست و ایجاد حساب‌ها"""
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [IsAccountingOrManagement]


class AccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    """ویو جزئیات حساب"""
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [IsAccountingOrManagement]


# Overdue Account Views
class OverdueAccountListCreateView(generics.ListCreateAPIView):
    """ویو لیست و ایجاد حساب‌های معوقه"""
    queryset = OverdueAccount.objects.all()
    serializer_class = OverdueAccountSerializer
    permission_classes = [IsAccountingOrManagement]


class OverdueAccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    """ویو جزئیات حساب معوقه"""
    queryset = OverdueAccount.objects.all()
    serializer_class = OverdueAccountSerializer
    permission_classes = [IsAccountingOrManagement]


# Discrepancy Views
class DiscrepancyListCreateView(generics.ListCreateAPIView):
    """ویو لیست و ایجاد مغایرت‌ها"""
    queryset = Discrepancy.objects.all()
    serializer_class = DiscrepancySerializer
    permission_classes = [IsAccountingOrManagement]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class DiscrepancyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """ویو جزئیات مغایرت"""
    queryset = Discrepancy.objects.all()
    serializer_class = DiscrepancySerializer
    permission_classes = [IsAccountingOrManagement]


# Follow Up Views
class FollowUpListCreateView(generics.ListCreateAPIView):
    """ویو لیست و ایجاد پیگیری‌ها"""
    queryset = FollowUp.objects.all()
    serializer_class = FollowUpSerializer
    permission_classes = [IsAccountingOrManagement]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class FollowUpDetailView(generics.RetrieveUpdateDestroyAPIView):
    """ویو جزئیات پیگیری"""
    queryset = FollowUp.objects.all()
    serializer_class = FollowUpSerializer
    permission_classes = [IsAccountingOrManagement]


# Payable Check Views
class PayableCheckListCreateView(generics.ListCreateAPIView):
    """ویو لیست و ایجاد چک‌های پرداختی"""
    queryset = PayableCheck.objects.all()
    serializer_class = PayableCheckSerializer
    permission_classes = [IsAccountingOrManagement]


class PayableCheckDetailView(generics.RetrieveUpdateDestroyAPIView):
    """ویو جزئیات چک پرداختی"""
    queryset = PayableCheck.objects.all()
    serializer_class = PayableCheckSerializer
    permission_classes = [IsAccountingOrManagement]


# Receivable Check Views
class ReceivableCheckListCreateView(generics.ListCreateAPIView):
    """ویو لیست و ایجاد چک‌های دریافتی"""
    queryset = ReceivableCheck.objects.all()
    serializer_class = ReceivableCheckSerializer
    permission_classes = [IsAccountingOrManagement]


class ReceivableCheckDetailView(generics.RetrieveUpdateDestroyAPIView):
    """ویو جزئیات چک دریافتی"""
    queryset = ReceivableCheck.objects.all()
    serializer_class = ReceivableCheckSerializer
    permission_classes = [IsAccountingOrManagement]


# Ongoing Debt Views
class OngoingDebtListCreateView(generics.ListCreateAPIView):
    """ویو لیست و ایجاد بدهی‌های در جریان"""
    queryset = OngoingDebt.objects.all()
    serializer_class = OngoingDebtSerializer
    permission_classes = [IsAccountingOrManagement]


class OngoingDebtDetailView(generics.RetrieveUpdateDestroyAPIView):
    """ویو جزئیات بدهی در جریان"""
    queryset = OngoingDebt.objects.all()
    serializer_class = OngoingDebtSerializer
    permission_classes = [IsAccountingOrManagement]


@api_view(['GET'])
@permission_classes([IsAccountingOrManagement])
def financial_summary(request):
    """ویو خلاصه مالی"""
    try:
        # محاسبه آمارهای مالی
        total_accounts = Account.objects.count()
        total_balance = Account.objects.aggregate(total=Sum('balance'))['total'] or 0
        
        overdue_accounts_count = OverdueAccount.objects.count()
        overdue_amount = OverdueAccount.objects.aggregate(total=Sum('overdue_amount'))['total'] or 0
        
        pending_discrepancies = Discrepancy.objects.filter(status='pending').count()
        
        payable_checks_count = PayableCheck.objects.filter(status='issued').count()
        receivable_checks_count = ReceivableCheck.objects.filter(status='received').count()
        
        ongoing_debts_count = OngoingDebt.objects.filter(status='pending').count()
        ongoing_debts_amount = OngoingDebt.objects.filter(status='pending').aggregate(total=Sum('amount'))['total'] or 0
        
        data = {
            'total_accounts': total_accounts,
            'total_balance': total_balance,
            'overdue_accounts_count': overdue_accounts_count,
            'overdue_amount': overdue_amount,
            'pending_discrepancies': pending_discrepancies,
            'payable_checks_count': payable_checks_count,
            'receivable_checks_count': receivable_checks_count,
            'ongoing_debts_count': ongoing_debts_count,
            'ongoing_debts_amount': ongoing_debts_amount,
        }
        
        serializer = FinancialSummarySerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
