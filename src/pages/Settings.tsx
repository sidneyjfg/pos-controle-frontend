import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/common';
import { useSettings } from '../hooks';
import type { CreateApiCredentialsDTO } from '../types';

export const Settings: React.FC = () => {
  const { credentials, loading, error, updateCredentials, createCredentials, testConnection } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const [formData, setFormData] = useState<CreateApiCredentialsDTO>({
    userApi: '',
    passwordApi: '',
    subscriptionKey: '',
  });

  useEffect(() => {
    if (credentials) {
      setFormData({
        userApi: credentials.userApi,
        passwordApi: '', // Não preenche a senha por segurança
        subscriptionKey: credentials.subscriptionKey,
      });
      setIsEditing(false);
    } else {
      setIsEditing(true); // Se não tem credenciais, já abre em modo edição
    }
  }, [credentials]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTestResult(null);
    
    try {
      if (credentials) {
        await updateCredentials(credentials.id, formData);
      } else {
        await createCredentials(formData);
      }
      setIsEditing(false);
      setFormData({ ...formData, passwordApi: '' }); // Limpa senha após salvar
    } catch (err) {
      console.error('Erro ao salvar:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testConnection();
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.response?.data?.message || 'Erro ao testar conexão',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleCancel = () => {
    if (credentials) {
      setFormData({
        userApi: credentials.userApi,
        passwordApi: '',
        subscriptionKey: credentials.subscriptionKey,
      });
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-800 mb-2">Configurações</h1>
          <p className="text-gray-600">Gerencie as credenciais da API externa</p>
        </div>
        {credentials && !isEditing && (
          <Button onClick={() => setIsEditing(true)} size="lg">
            <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Credenciais
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 px-6 py-4 rounded-xl mb-6 flex items-center shadow-sm animate-slide-in">
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Credenciais */}
        <div className="lg:col-span-2">
          <Card title="Credenciais da API Externa" className="animate-slide-in">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Status do JWT */}
              {credentials && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-blue-700 uppercase tracking-wide">Status do Token JWT</label>
                      <p className="text-sm text-blue-900 mt-1">
                        {credentials.jwt ? (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Token ativo
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Sem token
                          </span>
                        )}
                      </p>
                    </div>
                    {credentials.jwtExpiresAt && (
                      <div className="text-right">
                        <label className="block text-xs font-semibold text-blue-700 uppercase tracking-wide">Expira em</label>
                        <p className="text-sm text-blue-900 mt-1">
                          {new Date(credentials.jwtExpiresAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Campos do formulário */}
              <Input
                label="Usuário da API *"
                value={formData.userApi}
                onChange={(e) => setFormData({ ...formData, userApi: e.target.value })}
                disabled={!isEditing}
                required
                placeholder="Digite o usuário da API externa"
              />

              <Input
                label="Senha da API *"
                type="password"
                value={formData.passwordApi}
                onChange={(e) => setFormData({ ...formData, passwordApi: e.target.value })}
                disabled={!isEditing}
                required={!credentials}
                placeholder={credentials ? "Digite para alterar a senha" : "Digite a senha da API"}
              />

              <Input
                label="Subscription Key *"
                value={formData.subscriptionKey}
                onChange={(e) => setFormData({ ...formData, subscriptionKey: e.target.value })}
                disabled={!isEditing}
                required
                placeholder="Digite a chave de assinatura"
              />

              {/* Botões de ação */}
              {isEditing && (
                <div className="flex gap-3 pt-4 border-t">
                  {credentials && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                  )}
                  <Button
                    type="submit"
                    loading={isSaving}
                    disabled={isSaving}
                  >
                    {credentials ? 'Salvar Alterações' : 'Criar Credenciais'}
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>

        {/* Painel de Testes */}
        <div className="lg:col-span-1">
          <Card title="Testar Conexão" className="animate-slide-in">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Teste a conexão com a API externa para verificar se as credenciais estão corretas.
              </p>

              <Button
                onClick={handleTestConnection}
                loading={isTesting}
                disabled={isTesting || !credentials}
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Testar Conexão
              </Button>

              {testResult && (
                <div className={`rounded-xl p-4 border ${
                  testResult.success
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-start">
                    {testResult.success ? (
                      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <p className="text-sm">{testResult.message}</p>
                  </div>
                </div>
              )}

              {!credentials && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">Configure as credenciais antes de testar a conexão.</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Informações Adicionais */}
          <Card title="Informações" className="animate-slide-in mt-6">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p>As credenciais são usadas para autenticação na API externa do NerusMobile.</p>
              </div>
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <p>O JWT é renovado automaticamente quando expira.</p>
              </div>
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <p>Tokens têm validade de 1 hora.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
