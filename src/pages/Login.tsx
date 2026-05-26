import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { Button, Input } from '../components/common';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuth();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(credentials.username, credentials.password);
      navigate('/');
    } catch (err) {
      // Erro já tratado no contexto
      console.error('Erro no login:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo e Título */}
        <div className="text-center mb-8 animate-fade-in">
          <img
            src="/logo.png"
            alt="NérusMobile"
            className="h-24 w-auto mx-auto mb-4 drop-shadow-xl"
          />
          <h1 className="text-4xl font-black text-gray-800 mb-2">NérusMobile</h1>
          <p className="text-gray-600 font-medium">Sistema de Gerenciamento de Feiras</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-slide-in border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Entrar na sua conta</h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 text-red-800 px-4 py-3 rounded-xl mb-6 flex items-center animate-shake">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Usuário"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
              placeholder="Digite seu usuário"
              autoFocus
            />

            <Input
              label="Senha"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              placeholder="Digite sua senha"
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Use suas credenciais do sistema
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2026 NérusMobile Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};
