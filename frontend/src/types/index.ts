export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: 'management' | 'accounting';
  is_active: boolean;
  date_joined: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface Account {
  id: number;
  name: string;
  account_number: string;
  balance: string;
  is_active: boolean;
  created_at: string;
}

export interface OverdueAccount {
  id: number;
  account: number;
  account_name: string;
  customer_name: string;
  overdue_amount: string;
  due_date: string;
  contact_info: string;
  created_at: string;
}

export interface Discrepancy {
  id: number;
  title: string;
  description: string;
  amount: string;
  account: number;
  account_name: string;
  status: 'pending' | 'resolved' | 'rejected';
  created_by: number;
  created_by_name: string;
  created_at: string;
}

export interface FollowUp {
  id: number;
  title: string;
  description: string;
  customer_name: string;
  follow_up_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_by: number;
  created_by_name: string;
  created_at: string;
}

export interface PayableCheck {
  id: number;
  check_number: string;
  amount: string;
  payee: string;
  due_date: string;
  bank_name: string;
  status: 'issued' | 'paid' | 'returned';
  created_at: string;
}

export interface ReceivableCheck {
  id: number;
  check_number: string;
  amount: string;
  payer: string;
  due_date: string;
  bank_name: string;
  status: 'received' | 'deposited' | 'returned';
  created_at: string;
}

export interface OngoingDebt {
  id: number;
  creditor_name: string;
  amount: string;
  description: string;
  due_date: string;
  status: 'pending' | 'partial_paid' | 'paid';
  created_at: string;
}

export interface FinancialSummary {
  total_accounts: number;
  total_balance: string;
  overdue_accounts_count: number;
  overdue_amount: string;
  pending_discrepancies: number;
  payable_checks_count: number;
  receivable_checks_count: number;
  ongoing_debts_count: number;
  ongoing_debts_amount: string;
}
