import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair do sistema?')) {
      logout();
    }
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/products', label: 'Produtos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { path: '/fairs', label: 'Feiras', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { path: '/settings', label: 'Configurações', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  return (
    <nav className="bg-gradient-to-r from-nerus-700 via-nerus-600 to-nerus-700 text-white shadow-nerus backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo Nérus */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md group-hover:bg-white/30 transition-all duration-300"></div>
                <div className="relative bg-white rounded-2xl p-2.5 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-8 h-8 text-nerus-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.6v8.55c0 4.55-3.08 8.78-8 9.93-4.92-1.15-8-5.38-8-9.93V7.78l8-3.6zM11 7v2h2V7h-2zm0 4v6h2v-6h-2z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  Nérus
                </h1>
                <p className="text-xs text-nerus-100 font-medium -mt-1">NerusMobile</p>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  isActive(item.path)
                    ? 'bg-white text-nerus-700 shadow-lg scale-105'
                    : 'hover:bg-white/10 text-white hover:scale-105'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Divider */}
            <div className="h-8 w-px bg-white/20 mx-2"></div>
            
            {/* User Info */}
            <div className="flex items-center space-x-3 px-4 py-2 bg-white/10 rounded-xl">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  {user?.username || 'Usuário'}
                </p>
                <p className="text-xs text-nerus-100">
                  ID: {user?.userId}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 bg-red-500/20 text-white hover:bg-red-500 hover:scale-105 border border-red-300/30"
              title="Sair do sistema"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
