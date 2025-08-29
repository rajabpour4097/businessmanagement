from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from financial.models import Account, OverdueAccount, Discrepancy, FollowUp, PayableCheck, ReceivableCheck, OngoingDebt
from decimal import Decimal
from datetime import date, timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Create sample data for testing'

    def handle(self, *args, **options):
        # Create test users
        self.stdout.write('Creating test users...')
        
        # Create admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'full_name': 'مدیر سیستم',
                'role': 'management',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(f'Created admin user: {admin_user.username}')
        
        # Create accounting user
        accounting_user, created = User.objects.get_or_create(
            username='accounting',
            defaults={
                'email': 'accounting@example.com',
                'full_name': 'حسابدار ارشد',
                'role': 'accounting'
            }
        )
        if created:
            accounting_user.set_password('acc123')
            accounting_user.save()
            self.stdout.write(f'Created accounting user: {accounting_user.username}')

        # Create sample accounts
        self.stdout.write('Creating sample accounts...')
        
        accounts_data = [
            {'name': 'شرکت ABC', 'account_number': 'ACC001', 'balance': Decimal('2500000.00')},
            {'name': 'شرکت XYZ', 'account_number': 'ACC002', 'balance': Decimal('-500000.00')},
            {'name': 'فروشگاه مهر', 'account_number': 'ACC003', 'balance': Decimal('1200000.00')},
            {'name': 'شرکت پارس', 'account_number': 'ACC004', 'balance': Decimal('750000.00')},
            {'name': 'تأمین‌کننده نور', 'account_number': 'ACC005', 'balance': Decimal('-800000.00')},
        ]
        
        for account_data in accounts_data:
            account, created = Account.objects.get_or_create(
                account_number=account_data['account_number'],
                defaults=account_data
            )
            if created:
                self.stdout.write(f'Created account: {account.name}')

        # Create overdue accounts
        self.stdout.write('Creating overdue accounts...')
        
        overdue_accounts = [
            {
                'account_id': 2, 
                'customer_name': 'شرکت XYZ',
                'overdue_amount': Decimal('500000.00'), 
                'due_date': date.today() - timedelta(days=45),
                'contact_info': 'تلفن: 021-12345678'
            },
            {
                'account_id': 5, 
                'customer_name': 'تأمین‌کننده نور',
                'overdue_amount': Decimal('800000.00'), 
                'due_date': date.today() - timedelta(days=30),
                'contact_info': 'تلفن: 021-87654321'
            },
        ]
        
        for overdue_data in overdue_accounts:
            try:
                account = Account.objects.get(id=overdue_data['account_id'])
                overdue, created = OverdueAccount.objects.get_or_create(
                    account=account,
                    defaults={
                        'customer_name': overdue_data['customer_name'],
                        'overdue_amount': overdue_data['overdue_amount'],
                        'due_date': overdue_data['due_date'],
                        'contact_info': overdue_data['contact_info']
                    }
                )
                if created:
                    self.stdout.write(f'Created overdue account: {account.name}')
            except Account.DoesNotExist:
                continue

        # Create discrepancies
        self.stdout.write('Creating discrepancies...')
        
        discrepancies_data = [
            {
                'title': 'اختلاف فاکتور 1001',
                'description': 'اختلاف در محاسبه فاکتور شماره 1001', 
                'amount': Decimal('150000.00'), 
                'account_id': 1,
                'status': 'pending'
            },
            {
                'title': 'عدم تطابق موجودی',
                'description': 'عدم تطابق موجودی انبار با سیستم', 
                'amount': Decimal('250000.00'), 
                'account_id': 2,
                'status': 'pending'
            },
            {
                'title': 'خطا در ثبت پرداخت',
                'description': 'خطا در ثبت پرداخت نقدی', 
                'amount': Decimal('75000.00'), 
                'account_id': 3,
                'status': 'resolved'
            },
        ]
        
        for disc_data in discrepancies_data:
            try:
                account = Account.objects.get(id=disc_data['account_id'])
                disc, created = Discrepancy.objects.get_or_create(
                    title=disc_data['title'],
                    defaults={
                        'description': disc_data['description'],
                        'amount': disc_data['amount'],
                        'account': account,
                        'status': disc_data['status'],
                        'created_by': admin_user
                    }
                )
                if created:
                    self.stdout.write(f'Created discrepancy: {disc.title}')
            except Account.DoesNotExist:
                continue

        # Create follow-ups
        self.stdout.write('Creating follow-ups...')
        
        followups_data = [
            {
                'title': 'پیگیری مطالبات ABC',
                'description': 'پیگیری پرداخت مطالبات شرکت ABC', 
                'customer_name': 'شرکت ABC',
                'follow_up_date': date.today() + timedelta(days=3),
                'status': 'pending'
            },
            {
                'title': 'بررسی قرارداد جدید',
                'description': 'بررسی وضعیت قرارداد جدید', 
                'customer_name': 'شرکت پارس',
                'follow_up_date': date.today() + timedelta(days=5),
                'status': 'in_progress'
            },
            {
                'title': 'تسویه حساب تأمین‌کننده',
                'description': 'تماس با تأمین‌کننده برای تسویه حساب', 
                'customer_name': 'تأمین‌کننده نور',
                'follow_up_date': date.today() - timedelta(days=2),
                'status': 'completed'
            },
        ]
        
        for followup_data in followups_data:
            followup, created = FollowUp.objects.get_or_create(
                title=followup_data['title'],
                defaults={
                    'description': followup_data['description'],
                    'customer_name': followup_data['customer_name'],
                    'follow_up_date': followup_data['follow_up_date'],
                    'status': followup_data['status'],
                    'created_by': admin_user
                }
            )
            if created:
                self.stdout.write(f'Created follow-up: {followup.title}')

        # Create payable checks
        self.stdout.write('Creating payable checks...')
        
        payable_checks_data = [
            {
                'check_number': 'CHK001', 
                'amount': Decimal('500000.00'), 
                'payee': 'شرکت تأمین کالا',
                'due_date': date.today() + timedelta(days=15), 
                'bank_name': 'بانک ملی',
                'status': 'issued'
            },
            {
                'check_number': 'CHK002', 
                'amount': Decimal('750000.00'), 
                'payee': 'شرکت حمل و نقل',
                'due_date': date.today() + timedelta(days=30), 
                'bank_name': 'بانک صادرات',
                'status': 'issued'
            },
            {
                'check_number': 'CHK003', 
                'amount': Decimal('300000.00'), 
                'payee': 'اجاره دفتر',
                'due_date': date.today() - timedelta(days=5), 
                'bank_name': 'بانک تجارت',
                'status': 'paid'
            },
        ]
        
        for check_data in payable_checks_data:
            check, created = PayableCheck.objects.get_or_create(
                check_number=check_data['check_number'],
                defaults=check_data
            )
            if created:
                self.stdout.write(f'Created payable check: {check.check_number}')

        # Create receivable checks
        self.stdout.write('Creating receivable checks...')
        
        receivable_checks_data = [
            {
                'check_number': 'RCV001', 
                'amount': Decimal('400000.00'), 
                'payer': 'شرکت ABC',
                'due_date': date.today() + timedelta(days=10), 
                'bank_name': 'بانک ملی',
                'status': 'received'
            },
            {
                'check_number': 'RCV002', 
                'amount': Decimal('600000.00'), 
                'payer': 'فروشگاه مهر',
                'due_date': date.today() + timedelta(days=20), 
                'bank_name': 'بانک پاسارگاد',
                'status': 'received'
            },
        ]
        
        for check_data in receivable_checks_data:
            check, created = ReceivableCheck.objects.get_or_create(
                check_number=check_data['check_number'],
                defaults=check_data
            )
            if created:
                self.stdout.write(f'Created receivable check: {check.check_number}')

        # Create ongoing debts
        self.stdout.write('Creating ongoing debts...')
        
        debts_data = [
            {
                'creditor_name': 'بانک ملی',
                'description': 'بدهی بانکی کوتاه مدت', 
                'amount': Decimal('5000000.00'), 
                'due_date': date.today() + timedelta(days=90),
                'status': 'pending'
            },
            {
                'creditor_name': 'شرکت تجهیزات',
                'description': 'اقساط تجهیزات دفتری', 
                'amount': Decimal('1200000.00'), 
                'due_date': date.today() + timedelta(days=60),
                'status': 'pending'
            },
            {
                'creditor_name': 'تأمین‌کننده اصلی',
                'description': 'بدهی به تأمین‌کننده اصلی', 
                'amount': Decimal('2500000.00'), 
                'due_date': date.today() + timedelta(days=45),
                'status': 'partial_paid'
            },
        ]
        
        for debt_data in debts_data:
            debt, created = OngoingDebt.objects.get_or_create(
                creditor_name=debt_data['creditor_name'],
                defaults=debt_data
            )
            if created:
                self.stdout.write(f'Created debt: {debt.creditor_name}')

        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))
