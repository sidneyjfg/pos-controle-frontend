import { useState, useEffect } from 'react';
import { settingsService } from '../services';
import type { ApiCredentials, UpdateApiCredentialsDTO, CreateApiCredentialsDTO } from '../types';

export const useSettings = () => {
  const [credentials, setCredentials] = useState<ApiCredentials | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getApiCredentials();
      setCredentials(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar credenciais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const updateCredentials = async (id: number, data: UpdateApiCredentialsDTO) => {
    try {
      setError(null);
      const updated = await settingsService.updateApiCredentials(id, data);
      setCredentials(updated);
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar credenciais');
      throw err;
    }
  };

  const createCredentials = async (data: CreateApiCredentialsDTO) => {
    try {
      setError(null);
      const created = await settingsService.createApiCredentials(data);
      setCredentials(created);
      return created;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar credenciais');
      throw err;
    }
  };

  const testConnection = async () => {
    try {
      setError(null);
      const result = await settingsService.testConnection();
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao testar conexão');
      throw err;
    }
  };

  return {
    credentials,
    loading,
    error,
    refetch: fetchCredentials,
    updateCredentials,
    createCredentials,
    testConnection,
  };
};
