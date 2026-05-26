import React, { useEffect, useState } from 'react';
import { Card, Button, Input } from '../components/common';
import { useAuth, useSettings } from '../hooks';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const { credentials, loading, error, updateWebhook, testConnection } = useSettings();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSavingWebhook, setIsSavingWebhook] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setWebhookUrl(credentials?.webhookUrl || '');
  }, [credentials?.webhookUrl]);

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingWebhook(true);
    setMessage(null);

    try {
      await updateWebhook({ webhookUrl: webhookUrl.trim() || null });
      setMessage({ type: 'success', text: 'Webhook salvo com sucesso.' });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erro ao salvar webhook.',
      });
    } finally {
      setIsSavingWebhook(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setMessage(null);

    try {
      const result = await testConnection();
      setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erro ao testar credenciais internas.',
      });
    } finally {
      setIsTesting(false);
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
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-800 mb-2">Configurações</h1>
        <p className="text-gray-600">Acesso da nossa API e entrega de notas fiscais</p>
      </div>

      {(error || message) && (
        <div
          className={`border-l-4 px-6 py-4 rounded-xl mb-6 shadow-sm animate-slide-in ${
            message?.type === 'success'
              ? 'bg-green-50 border-green-600 text-green-800'
              : 'bg-red-50 border-red-600 text-red-800'
          }`}
        >
          {message?.text || error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card title="Acesso à nossa API" className="animate-slide-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Login</label>
                <div className="px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 font-semibold text-gray-900">
                  {user?.username || '-'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ID do cliente</label>
                <div className="px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 font-semibold text-gray-900">
                  {user?.userId || user?.id || '-'}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              A senha não é exibida no painel. Para trocar a senha de acesso, gere uma nova credencial no backend.
            </div>
          </Card>

          <Card title="Webhook de notas fiscais" className="animate-slide-in">
            <form onSubmit={handleSaveWebhook} className="space-y-5">
              <Input
                label="URL do webhook"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://cliente.com/webhooks/nfce"
              />

              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                Quando uma NFC-e nova for sincronizada, o backend envia o evento <span className="font-semibold">nfce.created</span> para esta URL.
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" loading={isSavingWebhook} disabled={isSavingWebhook}>
                  Salvar webhook
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setWebhookUrl('')}
                  disabled={isSavingWebhook}
                >
                  Limpar
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Status da integração" className="animate-slide-in">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-600">Credenciais internas</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  credentials ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {credentials ? 'Configuradas' : 'Ausentes'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-600">Webhook</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  credentials?.webhookUrl ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {credentials?.webhookUrl ? 'Ativo' : 'Não configurado'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Token NerusMobile</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  credentials?.hasJwt ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {credentials?.hasJwt ? 'Em cache' : 'Sem cache'}
                </span>
              </div>

              <Button
                type="button"
                onClick={handleTestConnection}
                loading={isTesting}
                disabled={isTesting || !credentials}
                className="w-full mt-2"
              >
                Testar integração
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
