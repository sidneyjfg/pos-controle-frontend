import { api } from './api';
import type { Fair, CreateFairDTO, UpdatePriceDTO } from '../types';

export const fairService = {
  async getAll(): Promise<Fair[]> {
    const response = await api.get<Fair[]>('/fairs');
    return response.data;
  },

  async getById(fairId: string): Promise<Fair> {
    const response = await api.get<Fair>(`/fairs/${fairId}`);
    return response.data;
  },

  async create(data: CreateFairDTO): Promise<Fair> {
    const response = await api.post<Fair>('/fairs', data);
    return response.data;
  },

  async updateProductPrice(fairId: string, internalCode: string, data: UpdatePriceDTO): Promise<void> {
    await api.patch(`/fairs/${fairId}/products/${internalCode}`, data);
  },

  async sync(fairId: string): Promise<void> {
    await api.post(`/fairs/${fairId}/sync`);
  },
};
