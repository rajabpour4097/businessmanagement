from django.urls import path
from .views import *

urlpatterns = [
    # Account URLs
    path('accounts/', AccountListCreateView.as_view(), name='account-list'),
    path('accounts/<int:pk>/', AccountDetailView.as_view(), name='account-detail'),
    
    # Overdue Account URLs
    path('overdue-accounts/', OverdueAccountListCreateView.as_view(), name='overdue-account-list'),
    path('overdue-accounts/<int:pk>/', OverdueAccountDetailView.as_view(), name='overdue-account-detail'),
    
    # Discrepancy URLs
    path('discrepancies/', DiscrepancyListCreateView.as_view(), name='discrepancy-list'),
    path('discrepancies/<int:pk>/', DiscrepancyDetailView.as_view(), name='discrepancy-detail'),
    
    # Follow Up URLs
    path('follow-ups/', FollowUpListCreateView.as_view(), name='followup-list'),
    path('follow-ups/<int:pk>/', FollowUpDetailView.as_view(), name='followup-detail'),
    
    # Payable Check URLs
    path('payable-checks/', PayableCheckListCreateView.as_view(), name='payable-check-list'),
    path('payable-checks/<int:pk>/', PayableCheckDetailView.as_view(), name='payable-check-detail'),
    
    # Receivable Check URLs
    path('receivable-checks/', ReceivableCheckListCreateView.as_view(), name='receivable-check-list'),
    path('receivable-checks/<int:pk>/', ReceivableCheckDetailView.as_view(), name='receivable-check-detail'),
    
    # Ongoing Debt URLs
    path('ongoing-debts/', OngoingDebtListCreateView.as_view(), name='ongoing-debt-list'),
    path('ongoing-debts/<int:pk>/', OngoingDebtDetailView.as_view(), name='ongoing-debt-detail'),
    
    # Summary
    path('summary/', financial_summary, name='financial-summary'),
]
