import { api } from './api';
import type { ApiCredentials, UpdateApiCredentialsDTO, CreateApiCredentialsDTO } from '../types';

export const settingsService = {
  async getApiCredentials(): Promise<ApiCredentials | null> {
    try {
      const response = await api.get<ApiCredentials>('/settings/api-credentials');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async createApiCredentials(data: CreateApiCredentialsDTO): Promise<ApiCredentials> {
    const response = await api.post<ApiCredentials>('/settings/api-credentials', data);
    return response.data;
  },

  async updateApiCredentials(id: number, data: UpdateApiCredentialsDTO): Promise<ApiCredentials> {
    const response = await api.put<ApiCredentials>(`/settings/api-credentials/${id}`, data);
    return response.data;
  },

  async testConnection(): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>('/settings/test-connection');
    return response.data;
  },
};
