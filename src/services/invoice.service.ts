import { api } from './api';
import type { Invoice, InvoicePage, SalesSyncResult } from '../types';

export const invoiceService = {
  async list(page = 1, limit = 10, search?: string): Promise<InvoicePage> {
    const response = await api.get<InvoicePage>('/sale/invoice', {
      params: { page, limit, search: search?.trim() || undefined },
    });
    return response.data;
  },

  async sync(): Promise<SalesSyncResult> {
    const response = await api.post<SalesSyncResult>('/sale/sync');
    return response.data;
  },

  async getByInvoice(numero: string, serie: string): Promise<Invoice> {
    const response = await api.get<Invoice>(`/sale/invoice/${numero}/${serie}`);
    return response.data;
  },
};
