import api from './api';
import {
  Account,
  OverdueAccount,
  Discrepancy,
  FollowUp,
  PayableCheck,
  ReceivableCheck,
  OngoingDebt,
  FinancialSummary,
} from '../types';

export const financialService = {
  // Accounts
  async getAccounts(): Promise<Account[]> {
    const response = await api.get('/financial/accounts/');
    return response.data.results || response.data;
  },

  async createAccount(data: Partial<Account>): Promise<Account> {
    const response = await api.post('/financial/accounts/', data);
    return response.data;
  },

  async updateAccount(id: number, data: Partial<Account>): Promise<Account> {
    const response = await api.patch(`/financial/accounts/${id}/`, data);
    return response.data;
  },

  async deleteAccount(id: number): Promise<void> {
    await api.delete(`/financial/accounts/${id}/`);
  },

  // Overdue Accounts
  async getOverdueAccounts(): Promise<OverdueAccount[]> {
    const response = await api.get('/financial/overdue-accounts/');
    return response.data.results || response.data;
  },

  async createOverdueAccount(data: Partial<OverdueAccount>): Promise<OverdueAccount> {
    const response = await api.post('/financial/overdue-accounts/', data);
    return response.data;
  },

  // Discrepancies
  async getDiscrepancies(): Promise<Discrepancy[]> {
    const response = await api.get('/financial/discrepancies/');
    return response.data.results || response.data;
  },

  async createDiscrepancy(data: Partial<Discrepancy>): Promise<Discrepancy> {
    const response = await api.post('/financial/discrepancies/', data);
    return response.data;
  },

  async updateDiscrepancy(id: number, data: Partial<Discrepancy>): Promise<Discrepancy> {
    const response = await api.patch(`/financial/discrepancies/${id}/`, data);
    return response.data;
  },

  // Follow-ups
  async getFollowUps(): Promise<FollowUp[]> {
    const response = await api.get('/financial/follow-ups/');
    return response.data.results || response.data;
  },

  async createFollowUp(data: Partial<FollowUp>): Promise<FollowUp> {
    const response = await api.post('/financial/follow-ups/', data);
    return response.data;
  },

  // Payable Checks
  async getPayableChecks(): Promise<PayableCheck[]> {
    const response = await api.get('/financial/payable-checks/');
    return response.data.results || response.data;
  },

  async createPayableCheck(data: Partial<PayableCheck>): Promise<PayableCheck> {
    const response = await api.post('/financial/payable-checks/', data);
    return response.data;
  },

  // Receivable Checks
  async getReceivableChecks(): Promise<ReceivableCheck[]> {
    const response = await api.get('/financial/receivable-checks/');
    return response.data.results || response.data;
  },

  async createReceivableCheck(data: Partial<ReceivableCheck>): Promise<ReceivableCheck> {
    const response = await api.post('/financial/receivable-checks/', data);
    return response.data;
  },

  // Ongoing Debts
  async getOngoingDebts(): Promise<OngoingDebt[]> {
    const response = await api.get('/financial/ongoing-debts/');
    return response.data.results || response.data;
  },

  async createOngoingDebt(data: Partial<OngoingDebt>): Promise<OngoingDebt> {
    const response = await api.post('/financial/ongoing-debts/', data);
    return response.data;
  },

  // Financial Summary
  async getFinancialSummary(): Promise<FinancialSummary> {
    const response = await api.get('/financial/summary/');
    return response.data;
  },
};
