import { api } from './api';
import type { CreateProductGroupDTO, ProductGroup } from '../types';

type ProductGroupResponse = {
  message: string;
  productGroup: ProductGroup;
};

export const productGroupService = {
  async getAll(): Promise<ProductGroup[]> {
    const response = await api.get<ProductGroup[]>('/product-groups');
    return response.data;
  },

  async create(data: CreateProductGroupDTO): Promise<ProductGroupResponse> {
    const response = await api.post<ProductGroupResponse>('/product-groups', data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateProductGroupDTO>): Promise<ProductGroupResponse> {
    const response = await api.put<ProductGroupResponse>(`/product-groups/${id}`, data);
    return response.data;
  },
};
