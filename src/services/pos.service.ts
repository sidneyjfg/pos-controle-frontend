import { api } from './api';
import type { Product, ProductType, ProductGroup, UnitType } from '../types';

export const posService = {
  async getExternalProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/external/products');
    return response.data;
  },

  async getProductTypes(): Promise<ProductType[]> {
    const response = await api.get<ProductType[]>('/external/producttypes');
    return response.data;
  },

  async getUnitTypes(): Promise<UnitType[]> {
    const response = await api.get<UnitType[]>('/external/unittypes');
    return response.data;
  },

  async getProductGroups(): Promise<ProductGroup[]> {
    const response = await api.get<ProductGroup[]>('/external/productgroups');
    return response.data;
  },
};
