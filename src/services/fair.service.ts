import { api } from './api';
import type { Fair, CreateFairDTO, UpdatePriceDTO, FairProduct, AddProductToFairDTO, UpdateFairProductPriceDTO } from '../types';

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

  // Gestão de produtos por feira
  async getFairProducts(fairId: string): Promise<FairProduct[]> {
    const response = await api.get<FairProduct[]>(`/fairs/${fairId}/products`);
    return response.data;
  },

  async addProductToFair(fairId: string, data: AddProductToFairDTO): Promise<FairProduct> {
    const response = await api.post<FairProduct>(`/fairs/${fairId}/products`, data);
    return response.data;
  },

  async updateFairProductPrice(fairId: string, internalCode: string, data: UpdateFairProductPriceDTO): Promise<FairProduct> {
    const response = await api.put<FairProduct>(`/fairs/${fairId}/products/${internalCode}`, data);
    return response.data;
  },

  async removeProductFromFair(fairId: string, internalCode: string): Promise<void> {
    await api.delete(`/fairs/${fairId}/products/${internalCode}`);
  },

  // Ativar/Desativar feira
  async toggleFairStatus(fairId: string, isActive: boolean): Promise<Fair> {
    const response = await api.patch<Fair>(`/fairs/${fairId}/status`, { isActive });
    return response.data;
  },
};
