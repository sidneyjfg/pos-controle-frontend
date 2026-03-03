import { api } from './api';
import type { Product, CreateProductDTO, ProductGroup, ProductType, UnitType, Status } from '../types';

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  async getById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async create(data: CreateProductDTO): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateProductDTO>): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async getProductGroups(): Promise<ProductGroup[]> {
    const response = await api.get<ProductGroup[]>('/product-groups');
    return response.data;
  },

  async getProductTypes(): Promise<ProductType[]> {
    const response = await api.get<ProductType[]>('/product-types');
    return response.data;
  },

  async getUnitTypes(): Promise<UnitType[]> {
    const response = await api.get<UnitType[]>('/unit-types');
    return response.data;
  },

  async getstatustypes(): Promise<Status[]> {
    const response = await api.get<Status[]>('/statustypes');
    return response.data;
  },
};
