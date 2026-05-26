import React, { useEffect, useState } from 'react';
import { Card, Button, Input } from '../components/common';
import { useAuth, useSettings } from '../hooks';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const { credentials, loading, error, updateWebhook, rotateApiAccess, testConnection } = useSettings();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSavingWebhook, setIsSavingWebhook] = useState(false);
  const [isRotatingAccess, setIsRotatingAccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [apiAccess, setApiAccess] = useState<{ clientId: string; clientSecret: string } | null>(null);

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

  const handleRotateApiAccess = async () => {
    const confirmed = window.confirm('Rotacionar o acesso técnico? O Client Secret anterior deixará de funcionar.');

    if (!confirmed) return;

    setIsRotatingAccess(true);
    setMessage(null);
    setApiAccess(null);

    try {
      const result = await rotateApiAccess();
      setApiAccess({
        clientId: result.clientId,
        clientSecret: result.clientSecret,
      });
      setMessage({ type: 'success', text: result.message });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Erro ao rotacionar acesso técnico.',
      });
    } finally {
      setIsRotatingAccess(false);
    }
  };

  const copyApiAccess = async () => {
    if (!apiAccess) return;

    await navigator.clipboard.writeText(`Client ID: ${apiAccess.clientId}\nClient Secret: ${apiAccess.clientSecret}`);
    setMessage({ type: 'success', text: 'Acesso técnico copiado.' });
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
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Login do painel</label>
              <div className="px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 font-semibold text-gray-900">
                {user?.username || '-'}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              A senha do painel não é exibida aqui. Ela serve apenas para acesso humano ao sistema.
            </div>
          </Card>

          <Card title="Acesso técnico para integração" className="animate-slide-in">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Client ID</label>
                <div className="px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 font-mono text-sm text-gray-900 break-all">
                  {user?.apiClientId || 'Não gerado para este usuário'}
                </div>
              </div>

              <div className="rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
                O Client Secret é exibido somente quando gerado ou rotacionado no backend. Use Client ID e Client Secret em <span className="font-semibold">POST /auth/token</span> para gerar o Bearer Token da integração.
              </div>

              {apiAccess && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-bold text-green-900 mb-3">Novo acesso técnico gerado</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-green-900 mb-1">Client ID</label>
                      <div className="px-3 py-2 rounded-lg bg-white border border-green-200 font-mono text-xs text-gray-900 break-all">
                        {apiAccess.clientId}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-green-900 mb-1">Client Secret</label>
                      <div className="px-3 py-2 rounded-lg bg-white border border-green-200 font-mono text-xs text-gray-900 break-all">
                        {apiAccess.clientSecret}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-green-900 mt-3">Guarde o Client Secret agora. Ele não será exibido novamente após sair desta tela.</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleRotateApiAccess}
                  loading={isRotatingAccess}
                  disabled={isRotatingAccess}
                >
                  Rotacionar acesso técnico
                </Button>

                {apiAccess && (
                  <Button type="button" onClick={copyApiAccess}>
                    Copiar acesso
                  </Button>
                )}
              </div>
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
